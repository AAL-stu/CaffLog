package com.cafflog.service;

import com.cafflog.dto.LoginResponse;
import com.cafflog.entity.User;
import com.cafflog.repository.UserRepository;
import com.cafflog.security.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final SessionService sessionService;

    @Value("${wechat.appid}")
    private String appid;

    @Value("${wechat.secret}")
    private String secret;

    private static final String WECHAT_API = "https://api.weixin.qq.com/sns/jscode2session";

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil,
                       RestTemplate restTemplate, ObjectMapper objectMapper,
                       SessionService sessionService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.sessionService = sessionService;
    }

    public LoginResponse login(String code) {
        // 1. 调用微信 code2Session 获取 openid
        String url = WECHAT_API + "?appid=" + appid + "&secret=" + secret +
                     "&js_code=" + code + "&grant_type=authorization_code";

        String openid;
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode json = objectMapper.readTree(response.getBody());

            if (json.has("errcode") && json.get("errcode").asInt() != 0) {
                throw new RuntimeException("微信登录失败: " + json.get("errmsg").asText());
            }
            openid = json.get("openid").asText();
        } catch (Exception e) {
            log.error("微信 code2Session 调用失败", e);
            throw new RuntimeException("微信登录失败，请稍后重试");
        }

        // 2. 查找或创建用户
        User user = userRepository.findByOpenid(openid).orElseGet(() -> {
            User newUser = User.builder().openid(openid).build();
            return userRepository.save(newUser);
        });

        // 3. 生成 JWT
        String token = jwtUtil.generateToken(user.getId(), openid);

        // 4. 创建 Redis session
        sessionService.create(user);

        return LoginResponse.builder()
                .token(token)
                .openid(openid)
                .userId(user.getId())
                .build();
    }
}
