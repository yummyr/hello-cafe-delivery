package com.yuan.exception;

/**
 * BaseException — custom business exception for application-level errors.
 *
 * Used for: validation errors, business logic conflicts, permission denial, etc.
 */
public class BaseException extends RuntimeException {

    public BaseException() {
        super();
    }

    public BaseException(String message) {
        super(message);
    }

    public BaseException(String message, Throwable cause) {
        super(message, cause);
    }

    public BaseException(Throwable cause) {
        super(cause);
    }
}
