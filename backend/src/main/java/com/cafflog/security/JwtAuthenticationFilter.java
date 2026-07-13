package com.cafflog.security;

import com.cafflog.entity.User;
import com.cafflog.repository.UserRepository;
import com.cafflog.service.SessionService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final SessionService sessionService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository,
                                    SessionService sessionService) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.sessionService = sessionService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            // 检查黑名单
            if (jwtUtil.isBlacklisted(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"success\":false,\"message\":\"Token 已失效，请重新登录\"}");
                return;
            }

            if (jwtUtil.validate(token)) {
                Long userId = jwtUtil.getUserId(token);
                userRepository.findById(userId).ifPresent(user -> {
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    // 更新活跃 session
                    sessionService.touch(user);
                });
            }
        }

        filterChain.doFilter(request, response);
    }
}
