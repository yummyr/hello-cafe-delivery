package com.yuan.utils;

import com.yuan.security.UserDetailsImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserUtils {

    /**
     * Get current user ID from SecurityContext
     * @return current user ID or null if not authenticated
     */
    public static Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                log.debug("No authentication found in SecurityContext");
                return null;
            }

            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetailsImpl) {
                Long userId = ((UserDetailsImpl) principal).getId();
                log.debug("Retrieved current user ID: {}", userId);
                return userId;
            }

            log.debug("Principal is not UserDetailsImpl: {}", principal.getClass().getSimpleName());
            return null;

        } catch (Exception e) {
            log.error("Error getting current user ID", e);
            return null;
        }
    }

    /**
     * Get current user from SecurityContext
     * @return current UserDetailsImpl or null if not authenticated
     */
    public static UserDetailsImpl getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                log.debug("No authentication found in SecurityContext");
                return null;
            }

            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetailsImpl) {
                UserDetailsImpl user = (UserDetailsImpl) principal;
                log.debug("Retrieved current user: {}, ID: {}", user.getUsername(), user.getId());
                return user;
            }

            log.debug("Principal is not UserDetailsImpl: {}", principal.getClass().getSimpleName());
            return null;

        } catch (Exception e) {
            log.error("Error getting current user", e);
            return null;
        }
    }

    /**
     * Get current username from SecurityContext
     * @return current username or null if not authenticated
     */
    public static String getCurrentUsername() {
        UserDetailsImpl currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getUsername() : null;
    }
}