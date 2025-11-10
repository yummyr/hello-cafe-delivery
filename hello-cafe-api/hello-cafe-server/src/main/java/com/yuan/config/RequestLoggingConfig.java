package com.yuan.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * Configuration for request/response logging
 */
@Configuration
@EnableAspectJAutoProxy
@EnableConfigurationProperties(RequestLoggingProperties.class)
@ConditionalOnProperty(prefix = "request-logging", name = "enabled", havingValue = "true", matchIfMissing = true)
public class RequestLoggingConfig {

    // This class enables AOP and configuration properties for request logging
    // The actual components are auto-detected via @ComponentScan
}