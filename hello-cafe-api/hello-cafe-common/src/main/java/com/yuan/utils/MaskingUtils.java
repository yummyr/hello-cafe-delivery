package com.yuan.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.util.regex.Pattern;

/**
 * Utility class for masking sensitive data in logs and other outputs
 */
@Slf4j
public class MaskingUtils {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    // Patterns for detecting sensitive data
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b"
    );

    private static final Pattern CREDIT_CARD_PATTERN = Pattern.compile(
        "\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b"
    );

    private static final Pattern SSN_PATTERN = Pattern.compile(
        "\\b\\d{3}-\\d{2}-\\d{4}\\b"
    );

    private static final Pattern JWT_PATTERN = Pattern.compile(
        "eyJ[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*"
    );

    /**
     * Masks sensitive data in a JSON string or plain text
     */
    public static String maskSensitiveFields(String content) {
        if (!StringUtils.hasText(content)) {
            return content;
        }

        try {
            // Try to parse as JSON first
            JsonNode node = objectMapper.readTree(content);
            return maskJsonNode(node).toString();
        } catch (JsonProcessingException e) {
            // Not a JSON string, apply pattern-based masking
            return maskByPatterns(content);
        }
    }

    /**
     * Recursively masks sensitive fields in a JSON node
     */
    private static JsonNode maskJsonNode(JsonNode node) {
        if (node.isObject()) {
            ObjectNode maskedNode = objectMapper.createObjectNode();
            node.fields().forEachRemaining(entry -> {
                String fieldName = entry.getKey().toLowerCase();
                if (isSensitiveField(fieldName)) {
                    maskedNode.put(entry.getKey(), "***");
                } else {
                    maskedNode.set(entry.getKey(), maskJsonNode(entry.getValue()));
                }
            });
            return maskedNode;
        } else if (node.isArray()) {
            ArrayNode maskedArray = objectMapper.createArrayNode();
            node.forEach(element -> maskedArray.add(maskJsonNode(element)));
            return maskedArray;
        } else if (node.isTextual()) {
            String textValue = node.asText();
            String maskedValue = maskByPatterns(textValue);
            return objectMapper.getNodeFactory().textNode(maskedValue);
        }
        return node;
    }

    /**
     * Applies pattern-based masking to plain text
     */
    private static String maskByPatterns(String text) {
        String masked = text;

        // Mask emails
        masked = EMAIL_PATTERN.matcher(masked)
            .replaceAll(match -> {
                String email = match.group();
                int atIndex = email.indexOf('@');
                String local = email.substring(0, atIndex);
                String domain = email.substring(atIndex);

                // Mask all but first and last character of local part
                if (local.length() > 2) {
                    local = local.charAt(0) + "*".repeat(local.length() - 2) + local.charAt(local.length() - 1);
                } else {
                    local = "*".repeat(local.length());
                }

                return local + domain;
            });

        // Mask phone numbers
        masked = PHONE_PATTERN.matcher(masked)
            .replaceAll(match -> {
                String phone = match.group().replaceAll("[^\\d]", "");
                if (phone.length() >= 4) {
                    return "***-***-" + phone.substring(phone.length() - 4);
                }
                return "***-***-****";
            });

        // Mask credit cards
        masked = CREDIT_CARD_PATTERN.matcher(masked)
            .replaceAll(match -> {
                String card = match.group().replaceAll("[^\\d]", "");
                if (card.length() >= 4) {
                    return "*".repeat(card.length() - 4) + card.substring(card.length() - 4);
                }
                return "****-****-****-****";
            });

        // Mask SSN
        masked = SSN_PATTERN.matcher(masked)
            .replaceAll("***-**-****");

        // Mask JWT tokens
        masked = JWT_PATTERN.matcher(masked)
            .replaceAll("eyJ***.eyJ***.***");

        // Mask API keys (common patterns)
        masked = masked.replaceAll("(?i)(api[_-]?key|apikey)[\"']?\\s*[:=]\\s*[\"']?([a-zA-Z0-9_-]{20,})[\"']?",
                           "$1: ***");
        masked = masked.replaceAll("(?i)(secret[_-]?key|secretkey)[\"']?\\s*[:=]\\s*[\"']?([a-zA-Z0-9_-]{20,})[\"']?",
                           "$1: ***");

        return masked;
    }

    /**
     * Checks if a field name is considered sensitive
     */
    private static boolean isSensitiveField(String fieldName) {
        return fieldName.contains("password") ||
               fieldName.contains("token") ||
               fieldName.contains("secret") ||
               fieldName.contains("key") ||
               fieldName.contains("credential") ||
               fieldName.contains("auth") ||
               fieldName.contains("access") ||
               fieldName.contains("refresh") ||
               fieldName.contains("credit") ||
               fieldName.contains("card") ||
               fieldName.contains("ssn") ||
               fieldName.contains("social") ||
               fieldName.contains("bank") ||
               fieldName.contains("account") ||
               fieldName.contains("pin") ||
               fieldName.contains("cvv") ||
               fieldName.contains("cvc");
    }

    /**
     * Masks a sensitive value completely
     */
    public static String maskCompletely(String value) {
        if (!StringUtils.hasText(value)) {
            return value;
        }
        return "***";
    }

    /**
     * Masks a value keeping only first N and last M characters visible
     */
    public static String maskPartial(String value, int keepFirst, int keepLast) {
        if (!StringUtils.hasText(value)) {
            return value;
        }

        if (value.length() <= keepFirst + keepLast) {
            return "*".repeat(value.length());
        }

        String first = value.substring(0, keepFirst);
        String last = value.substring(value.length() - keepLast);
        String middle = "*".repeat(value.length() - keepFirst - keepLast);

        return first + middle + last;
    }

    /**
     * Masks email address while preserving domain
     */
    public static String maskEmail(String email) {
        if (!StringUtils.hasText(email) || !email.contains("@")) {
            return email;
        }

        int atIndex = email.indexOf('@');
        String local = email.substring(0, atIndex);
        String domain = email.substring(atIndex);

        if (local.length() <= 2) {
            return "*".repeat(local.length()) + domain;
        }

        String maskedLocal = local.charAt(0) + "*".repeat(local.length() - 2) + local.charAt(local.length() - 1);
        return maskedLocal + domain;
    }
}