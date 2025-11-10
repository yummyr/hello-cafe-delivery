package com.yuan.filter;

import com.yuan.config.RequestLoggingProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;

@Slf4j
@Component
@Order(Ordered.LOWEST_PRECEDENCE)
@RequiredArgsConstructor
public class RequestResponseLoggingFilter extends OncePerRequestFilter {

    private final RequestLoggingProperties loggingProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

        // Skip logging if disabled or for certain paths
        if (!isEnabled(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Wrap request and response to allow multiple reads
        ContentCachingRequestWrapper wrappedRequest;
        ContentCachingResponseWrapper wrappedResponse;

        try {
            wrappedRequest = wrapRequest(request);
            wrappedResponse = wrapResponse(response);
        } catch (IOException e) {
            log.debug("Failed to wrap request/response for logging: {}", e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            // Ensure response is copied to original response
            wrappedResponse.copyBodyToResponse();
        }
    }

    private boolean isEnabled(HttpServletRequest request) {
        if (!loggingProperties.isEnabled()) {
            return false;
        }

        String path = request.getRequestURI();
        return loggingProperties.getSkipPaths().stream().noneMatch(path::contains);
    }

    private ContentCachingRequestWrapper wrapRequest(HttpServletRequest request) throws IOException {
        if (request instanceof ContentCachingRequestWrapper) {
            return (ContentCachingRequestWrapper) request;
        }

        // Determine if we should cache the request body based on content type and method
        boolean shouldCache = shouldCacheRequestBody(request);

        if (shouldCache) {
            return new CachedBodyHttpServletRequest(request);
        }

        return new ContentCachingRequestWrapper(request, loggingProperties.getMaxPayloadSize());
    }

    private ContentCachingResponseWrapper wrapResponse(HttpServletResponse response) {
        if (response instanceof ContentCachingResponseWrapper) {
            return (ContentCachingResponseWrapper) response;
        }

        return new ContentCachingResponseWrapper(response);
    }

    private boolean shouldCacheRequestBody(HttpServletRequest request) {
        String method = request.getMethod();
        String contentType = request.getContentType();

        // Only cache for methods that typically have bodies
        if (!"POST".equals(method) && !"PUT".equals(method) && !"PATCH".equals(method)) {
            return false;
        }

        // Don't cache for file uploads
        if (contentType != null && contentType.toLowerCase().contains("multipart")) {
            return false;
        }

        // Don't cache for binary content types
        if (contentType != null && isBinaryContentType(contentType)) {
            return false;
        }

        return true;
    }

    private boolean isBinaryContentType(String contentType) {
        String lowerContentType = contentType.toLowerCase();
        return lowerContentType.contains("image/") ||
               lowerContentType.contains("video/") ||
               lowerContentType.contains("audio/") ||
               lowerContentType.contains("application/octet-stream") ||
               lowerContentType.contains("application/pdf") ||
               lowerContentType.contains("application/zip");
    }

    /**
     * Custom HttpServletRequest wrapper that caches the body for multiple reads
     */
    private static class CachedBodyHttpServletRequest extends ContentCachingRequestWrapper {

        public CachedBodyHttpServletRequest(HttpServletRequest request) {
            super(request);
            // Let the parent class handle content caching automatically
            // Don't manually read the input stream here as it can cause issues
        }
    }
}