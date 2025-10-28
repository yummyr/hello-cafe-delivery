package com.yuan.exception;

/**
 * Custom exception thrown when login fails due to invalid credentials
 * or other authentication-related issues.
 */
public class LoginFailedException extends RuntimeException {

    /**
     * Constructs a new LoginFailedException with a specific message.
     *
     * @param message a detailed error message
     */
    public LoginFailedException(String message) {
        super(message);
    }

    /**
     * (Optional) Constructs a new LoginFailedException with a message and cause.
     *
     * @param message a detailed error message
     * @param cause   the original cause of the exception
     */
    public LoginFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}
