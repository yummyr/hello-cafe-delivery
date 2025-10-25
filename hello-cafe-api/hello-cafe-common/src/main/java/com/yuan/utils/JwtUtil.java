package com.yuan.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Slf4j
public class JwtUtil {
    /**
     * generate JWT token
     *
     * @param secretKey
     * @param ttlMillis expire time in mill seconds
     * @param claims    customized payload (id, username, role, tokenType)
     * @return Jwt String: token
     */
    public static String createJWT(String secretKey, long ttlMillis, Map<String, Object> claims) {
        try {
            long nowMillis = System.currentTimeMillis();
            Date now = new Date(System.currentTimeMillis());
            SecretKey key = getSecretKey(secretKey);

            return Jwts.builder()
                    .setClaims(claims)
                    .setIssuedAt(now)
                    .setExpiration(new Date(nowMillis + ttlMillis))
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("JWT creation failed: " + e.getMessage(), e);
        }
    }

    /**
     * parse JWT token
     *
     * @param secretKey
     * @param token:Jwt String
     * @return claims customized payload (id, username, role, tokenType)
     */
    public static Claims parseJWT(String secretKey, String token) {
        try {
            SecretKey key = getSecretKey(secretKey);

            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (Exception e) {
            throw new RuntimeException("JWT parsing failed: " + e.getMessage(), e);
        }
    }

    private static SecretKey getSecretKey(String secretKey) {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

}