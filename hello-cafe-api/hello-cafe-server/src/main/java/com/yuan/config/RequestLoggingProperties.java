package com.yuan.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Data
@ConfigurationProperties(prefix = "request-logging")
public class RequestLoggingProperties {

    /**
     * Enable/disable request/response logging
     */
    private boolean enabled = true;

    /**
     * Log incoming requests
     */
    private boolean logRequests = true;

    /**
     * Log outgoing responses
     */
    private boolean logResponses = true;

    /**
     * Log method return values (when not already logged as response body)
     */
    private boolean logMethodResults = false;

    /**
     * Maximum payload size to log (in bytes)
     */
    private int maxPayloadSize = 1024 * 1024; // 1MB

    /**
     * Paths to skip logging
     */
    private List<String> skipPaths = List.of(
        "/actuator",
        "/health",
        "/metrics",
        "/info",
        "/favicon.ico",
        "/error"
    );

    /**
     * User agents to skip logging (for health checks, bots, etc.)
     */
    private List<String> skipUserAgents = List.of(
        "kube-probe",
        "Prometheus",
        "ELB-HealthChecker",
        "AWS-HealthChecker"
    );

    /**
     * HTTP headers that contain sensitive information and should be masked
     */
    private List<String> sensitiveHeaders = List.of(
        "authorization",
        "cookie",
        "set-cookie",
        "x-api-key",
        "x-auth-token",
        "x-forwarded-for",
        "x-real-ip",
        "proxy-authorization"
    );

    /**
     * Request parameters that contain sensitive information and should be masked
     */
    private List<String> sensitiveParameters = List.of(
        "password",
        "token",
        "secret",
        "key",
        "credential",
        "auth",
        "access_token",
        "refresh_token"
    );

    /**
     * JSON fields that contain sensitive information and should be masked
     */
    private List<String> sensitiveFields = List.of(
        "password",
        "token",
        "secret",
        "key",
        "credential",
        "auth",
        "accessToken",
        "refreshToken",
        "creditCard",
        "ssn",
        "socialSecurityNumber",
        "bankAccount",
        "pin",
        "cvv",
        "cvc",
        "cardNumber",
        "cardnumber"
    );
}