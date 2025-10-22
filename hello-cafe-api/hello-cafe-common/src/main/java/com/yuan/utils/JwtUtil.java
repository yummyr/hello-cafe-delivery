package com.yuan.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.Callable;

@Slf4j
public class JwtUtil {

    /**
     * generate JWT token
     * @param secretKey
     * @param ttlMillis expire time in mill seconds
     * @param claims customized payload (id, username, role, tokenType)
     * @return Jwt String: token
     */
    public static String createJWT(String secretKey, long ttlMillis, Map<String, Object> claims) {
        try {
            long nowMillis = System.currentTimeMillis();
            Date now = new Date(System.currentTimeMillis());

            SecretKey key = getSecretKey(secretKey);
            System.out.println("Using secret key in create: " + secretKey);
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
     * @param secretKey
     * @param token :Jwt String
     * @return  claims customized payload (id, username, role, tokenType)
     */
    public static Claims parseJWT(String secretKey, String token) {
        try {
            SecretKey key = getSecretKey(secretKey);
            System.out.println("Using secret key in parse: " + secretKey);
            System.out.println("Key algorithm: " + key.getAlgorithm());
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
            return false;
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

    /**
     *
     * @param token :JWT token String
     * @return Json tokenType
     */
    public static String getTokenType(String token){
       try {
           log.info("token in getTokenType:{}", token);
           String[] parts = token.split("\\.");

           if (parts.length == 3){
               log.info("part 1 in getTokenType:{}", parts[1]);
               String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));
               return payloadJson;
           }
       }catch (Exception e){
           log.warn("Cannot get token payload:{}",e.getMessage());
       }
       return null;
    }

    private static SecretKey getSecretKey(String secretKey) {
        byte[] keyBytes;
        try {
            keyBytes = Base64.getDecoder().decode(secretKey);
        } catch (IllegalArgumentException e) {
            keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }
}