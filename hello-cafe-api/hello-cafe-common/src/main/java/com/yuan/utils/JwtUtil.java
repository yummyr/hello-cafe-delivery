package com.yuan.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

public class JwtUtil {

    /**
     * generate JWT token
     */
    public static String createJWT(String secretKey, long ttlMillis, Map<String, Object> claims) {
        try {
            long nowMillis = System.currentTimeMillis();
            Date now = new Date(nowMillis);

            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

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
     */
    public static Claims parseJWT(String secretKey, String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (Exception e) {
            throw new RuntimeException("JWT parsing failed: " + e.getMessage(), e);
        }
    }

    /**
     * verify if token expired
     */
    public static boolean isTokenExpired(String secretKey, String token) {
        try {
            Claims claims = parseJWT(secretKey, token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * get Username From Token
     */
    public static String getUsernameFromToken(String secretKey, String token) {
        try {
            Claims claims = parseJWT(secretKey, token);
            return claims.get("username", String.class);
        } catch (Exception e) {
            return null;
        }
    }
}