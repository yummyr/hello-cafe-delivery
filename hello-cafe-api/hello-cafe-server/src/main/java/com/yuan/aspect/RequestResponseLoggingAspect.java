package com.yuan.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuan.config.RequestLoggingProperties;
import com.yuan.utils.MaskingUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RequestResponseLoggingAspect {

    private final ObjectMapper objectMapper;
    private final RequestLoggingProperties loggingProperties;

    @Around("execution(* com.yuan.controller..*(..))")
    public Object logRequestResponse(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return joinPoint.proceed();
        }

        HttpServletRequest request = attributes.getRequest();
        HttpServletResponse response = attributes.getResponse();

        // Skip logging for health checks and actuator endpoints
        if (shouldSkipLogging(request)) {
            return joinPoint.proceed();
        }

        long startTime = System.currentTimeMillis();
        String requestId = UUID.randomUUID().toString().substring(0, 8);

        // Prepare request log
        Map<String, Object> requestLog = prepareRequestLog(request, joinPoint, requestId);

        Object result = null;
        Exception exception = null;

        try {
            result = joinPoint.proceed();
            return result;
        } catch (Exception e) {
            exception = e;
            throw e;
        } finally {
            long duration = System.currentTimeMillis() - startTime;

            // Log request
            logRequest(requestLog);

            // Log response
            logResponse(response, result, exception, requestId, duration);
        }
    }

    private boolean shouldSkipLogging(HttpServletRequest request) {
        String path = request.getRequestURI();
        String userAgent = request.getHeader("User-Agent");

        return loggingProperties.getSkipPaths().stream().anyMatch(path::contains) ||
               (userAgent != null && loggingProperties.getSkipUserAgents().stream()
                   .anyMatch(userAgent::contains));
    }

    private Map<String, Object> prepareRequestLog(HttpServletRequest request, ProceedingJoinPoint joinPoint, String requestId) {
        Map<String, Object> requestLog = new LinkedHashMap<>();

        // requestLog.put("requestId", requestId);
        // requestLog.put("timestamp", LocalDateTime.now().toString());
        requestLog.put("method", request.getMethod());
        requestLog.put("path", request.getRequestURI());
        requestLog.put("queryString", request.getQueryString());

        // Headers
        Map<String, String> headers = new LinkedHashMap<>();
        Collections.list(request.getHeaderNames()).forEach(headerName -> {
            if (!loggingProperties.getSensitiveHeaders().contains(headerName.toLowerCase())) {
                headers.put(headerName, request.getHeader(headerName));
            } else {
                headers.put(headerName, "***");
            }
        });
        // requestLog.put("headers", headers);

        // Client information
        // requestLog.put("clientIP", getClientIP(request));
        // requestLog.put("userAgent", request.getHeader("User-Agent"));

        // Request parameters
        Map<String, String[]> parameterMap = request.getParameterMap();
        Map<String, Object> parameters = new LinkedHashMap<>();
        parameterMap.forEach((key, values) -> {
            if (loggingProperties.getSensitiveParameters().contains(key.toLowerCase())) {
                parameters.put(key, "***");
            } else {
                parameters.put(key, values.length == 1 ? values[0] : Arrays.asList(values));
            }
        });
        requestLog.put("parameters", parameters);

        // Request body (for POST, PUT, PATCH) - be more careful about accessing the content
        if (request instanceof ContentCachingRequestWrapper &&
            shouldLogBody(request.getMethod())) {
            ContentCachingRequestWrapper wrapper = (ContentCachingRequestWrapper) request;
            try {
                byte[] content = wrapper.getContentAsByteArray();
                if (content.length > 0) {
                    String body = new String(content, request.getCharacterEncoding() != null ?
                                           request.getCharacterEncoding() : "UTF-8");
                    requestLog.put("body", maskSensitiveData(body));
                }
            } catch (Exception e) {
                log.debug("Failed to read request body: {}", e.getMessage());
                requestLog.put("body", "[Failed to read body]");
            }
        }

        // Method information
        requestLog.put("controller", joinPoint.getTarget().getClass().getSimpleName());
        requestLog.put("method", joinPoint.getSignature().getName());

        return requestLog;
    }

    private void logRequest(Map<String, Object> requestLog) {
        if (loggingProperties.isLogRequests()) {
            log.info("Incoming Request: {}", maskSensitiveData(requestLog));
        }
    }

    private void logResponse(HttpServletResponse response, Object result, Exception exception,
                           String requestId, long duration) {
        if (!loggingProperties.isLogResponses()) {
            return;
        }

        Map<String, Object> responseLog = new LinkedHashMap<>();

        // responseLog.put("requestId", requestId);
        // responseLog.put("timestamp", LocalDateTime.now().toString());
        responseLog.put("status", response.getStatus());
        responseLog.put("duration", duration + "ms");

        // Response headers
        Map<String, String> headers = new LinkedHashMap<>();
        for (String headerName : response.getHeaderNames()) {
            headers.put(headerName, response.getHeader(headerName));
        }
        // responseLog.put("headers", headers);

        // Response body - handle more carefully to avoid interference
        if (response instanceof ContentCachingResponseWrapper &&
            shouldLogResponseBody(response.getStatus())) {
            ContentCachingResponseWrapper wrapper = (ContentCachingResponseWrapper) response;
            try {
                byte[] content = wrapper.getContentAsByteArray();
                if (content.length > 0) {
                    String encoding = response.getCharacterEncoding() != null ?
                                     response.getCharacterEncoding() : "UTF-8";
                    String body = new String(content, encoding);
                    responseLog.put("body", maskSensitiveData(body));
                }
                // Copy body to response should be done in the filter, not here
            } catch (Exception e) {
                log.debug("Failed to read response body: {}", e.getMessage());
                responseLog.put("body", "[Failed to read body]");
            }
        }

        // Error information
        if (exception != null) {
            responseLog.put("error", exception.getClass().getSimpleName());
            responseLog.put("message", exception.getMessage());
        }

        // Method result (if successful and not already logged as body)
        if (result != null && exception == null &&
            !responseLog.containsKey("body") &&
            loggingProperties.isLogMethodResults()) {
            responseLog.put("result", maskSensitiveData(result));
        }

        String logLevel = response.getStatus() >= 400 ? "warn" : "info";
        if (response.getStatus() >= 500 || exception != null) {
            logLevel = "error";
        }

        switch (logLevel) {
            case "warn":
                log.warn("Outgoing Response: {}", maskSensitiveData(responseLog));
                break;
            case "error":
                log.error("Outgoing Response: {}", maskSensitiveData(responseLog));
                break;
            default:
                log.info("Outgoing Response: {}", maskSensitiveData(responseLog));
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }

        return request.getRemoteAddr();
    }

    private boolean shouldLogBody(String method) {
        return Arrays.asList("POST", "PUT", "PATCH").contains(method);
    }

    private boolean shouldLogResponseBody(int status) {
        return status < 400; // Don't log error response bodies to avoid sensitive error details
    }

    private Object maskSensitiveData(Object data) {
        try {
            if (data instanceof String) {
                return MaskingUtils.maskSensitiveFields((String) data);
            }
            String jsonString = objectMapper.writeValueAsString(data);
            return objectMapper.readValue(MaskingUtils.maskSensitiveFields(jsonString), Object.class);
        } catch (Exception e) {
            log.debug("Failed to mask sensitive data: {}", e.getMessage());
            return data instanceof String ? data : "[Object]";
        }
    }
}