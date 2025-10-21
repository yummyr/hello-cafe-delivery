package com.yuan.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "hello-cafe.jwt")
public class JwtProperties {
    /***
     * JWT secret key for admin tokens
     */
    private String adminSecretKey;
    private long adminTtl;// in milliseconds
    private String adminTokenName;

    /***
     * JWT secret key for user tokens
     */
    private String userSecretKey;
    private long userTtl;// in milliseconds
    private String userTokenName;
}
