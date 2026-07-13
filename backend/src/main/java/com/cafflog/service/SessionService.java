package com.cafflog.service;

import com.cafflog.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class SessionService {

    private static final String SESSION_PREFIX = "session:";
    private static final long SESSION_TTL_DAYS = 7;

    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 用户登录时创建 session 记录
     */
    public void create(User user) {
        String now = Instant.now().toString();
        redisTemplate.opsForHash().put(SESSION_PREFIX + user.getId(), "lastActive", now);
        redisTemplate.opsForHash().put(SESSION_PREFIX + user.getId(), "openid", user.getOpenid());
        redisTemplate.expire(SESSION_PREFIX + user.getId(), SESSION_TTL_DAYS, TimeUnit.DAYS);
    }

    /**
     * 每次 API 请求时更新最后活跃时间
     */
    public void touch(User user) {
        String key = SESSION_PREFIX + user.getId();
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            redisTemplate.opsForHash().put(key, "lastActive", Instant.now().toString());
            redisTemplate.expire(key, SESSION_TTL_DAYS, TimeUnit.DAYS);
        }
    }

    /**
     * 用户登出或 token 过期时删除 session
     */
    public void delete(Long userId) {
        redisTemplate.delete(SESSION_PREFIX + userId);
    }
}
