package com.yuan.config;

import com.yuan.context.UserContext;
import com.yuan.properties.JwtProperties;
import com.yuan.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtProperties jwtProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            log.info("Auth header: {}", authHeader);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                Claims claims = parseClaimsSafely(token);
                if (claims == null) {
                    log.warn("JWT解析失败，跳过认证流程");
                } else {
                    Long userId = claims.get("id", Long.class);
                    String username = claims.get("username", String.class);
                    String role = claims.get("role", String.class); // 获取角色

                    log.info("JWT解析结果 - userId: {}, username: {}, role: {}",
                            userId, username, role);

                    if (userId != null) {
                        UserContext.setCurrentUserId(userId);
                        log.debug("Set current userId in context: {}", userId);

                        setAuthentication(username, role, userId);
                    }
                }
            }

            // continue next filter
            filterChain.doFilter(request, response);
        } finally {
            UserContext.clear();
        }
    }

    /**
     * parse token based on secretKey type: adminSecretKey || userSecretKey
     */
    private Claims parseClaimsSafely(String token) {
        try {
            // try to parse using adminSecretKey  (employee)
            Claims claims = JwtUtil.parseJWT(jwtProperties.getAdminSecretKey(), token);
            log.info("parse token successfully using adminSecretKey ");
            return claims;
        } catch (Exception e1) {
            try {
                // try to parse using userSecretKey(customer)
                Claims claims = JwtUtil.parseJWT(jwtProperties.getUserSecretKey(), token);
                log.info("parse token successfully using userSecretKey ");
                return claims;
            } catch (Exception e2) {
                log.warn("fail to parse token using both adminSecretKey and userSecretKey: {}", e2.getMessage());
                return null;
            }
        }
    }
    private void setAuthentication(String username, String role, Long userId) {
        if (username != null && role != null) {
            // add prefix for role as Spring Security requirement
            String authority = "ROLE_" + role.toUpperCase();

            List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority(authority)
            );

            // create authentication obj
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);

            // add more info into details
            authentication.setDetails(Map.of(
                    "userId", userId,
                    "role", role,
                    "username", username
            ));

            // set SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.info("set security context: username={}, role={}, authority={}", username, role, authority);
        }else {
            log.warn("fail to set security contex: username={}, role={}", username, role);
        }
    }
}
