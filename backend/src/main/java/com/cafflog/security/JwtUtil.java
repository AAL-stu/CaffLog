package com.cafflog.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
public class JwtUtil {

    private static final String BLACKLIST_PREFIX = "jwt:blacklist:";

    private final SecretKey key;
    private final long expiration;
    private final RedisTemplate<String, Object> redisTemplate;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration}") long expiration,
                   RedisTemplate<String, Object> redisTemplate) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
        this.redisTemplate = redisTemplate;
    }

    public String generateToken(Long userId, String openid) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(openid)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public String getOpenid(String token) {
        return parseClaims(token).getSubject();
    }

    public Long getUserId(String token) {
        return parseClaims(token).get("userId", Long.class);
    }

    public boolean validate(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * 将 token 加入黑名单（退出登录时调用）
     */
    public void blacklist(String token) {
        if (!validate(token)) return;
        long remaining = getRemainingMs(token);
        if (remaining <= 0) return;
        redisTemplate.opsForValue()
                .set(BLACKLIST_PREFIX + token, "1", remaining, TimeUnit.MILLISECONDS);
    }

    /**
     * 检查 token 是否在黑名单中
     */
    public boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + token));
    }

    /**
     * 计算 token 剩余有效期（毫秒）
     */
    public long getRemainingMs(String token) {
        try {
            Date exp = parseClaims(token).getExpiration();
            return exp.getTime() - System.currentTimeMillis();
        } catch (Exception e) {
            return 0;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
