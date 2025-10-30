package com.yuan.security;

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
            // log.info("Auth header: {}", authHeader);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                Claims claims = parseClaimsSafely(token);
                if (claims == null) {
                    log.warn("Fail to parse，skip authorization");
                } else {
                    Long userId = claims.get("id", Long.class);
                    String username = claims.get("username", String.class);
                    String role = claims.get("role", String.class);

                    if (userId != null) {
                        UserContext.setCurrentUserId(userId);
                        // log.debug("Set current userId in context: {}", userId);
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
        Claims claims = null;
        // try to parse using admin key
        try {
            claims = JwtUtil.parseJWT(jwtProperties.getAdminSecretKey(), token);
        } catch (Exception e) {
            log.debug("Failed to parse with admin key: {}", e.getMessage());
        }

        // try to parse using user key
        if (claims == null) {
            try {
                claims = JwtUtil.parseJWT(jwtProperties.getUserSecretKey(), token);
            } catch (Exception e) {
                log.debug("Failed to parse with user key: {}", e.getMessage());
            }
        }
        // log.info("JwtAuthFilter.java claims:{}",claims);
        return claims;
    }

    private void setAuthentication(String username, String role, Long userId) {
        if (username != null && role != null) {
            // add prefix for role as Spring Security requirement
            String authority = "ROLE_" + role.toUpperCase();

            List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority(authority)
            );

            // create authentication obj as principal
            UserDetailsImpl userDetails = new UserDetailsImpl(userId, username, null, authorities);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, authorities);


            // add more info into details
            authentication.setDetails(Map.of(
                    "userId", userId,
                    "role", role,
                    "username", username
            ));

            // set SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // log.info("set security context: username={}, role={}, authority={}", username, role, authority);
        } else {
            log.warn("fail to set security context: username={}, role={}", username, role);
        }
    }
}
