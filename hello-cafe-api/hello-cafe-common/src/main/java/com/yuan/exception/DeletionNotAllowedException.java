package com.yuan.exception;

/**
 * Custom exception thrown when a deletion operation is not allowed.
 * For example, when a category is still referenced by menu or combo items.
 */
public class DeletionNotAllowedException extends RuntimeException {

    /**
     * Constructor that accepts a custom error message.
     *
     * @param msg the error message to be shown to the user or logged
     */
    public DeletionNotAllowedException(String msg) {
        super(msg);
    }

    /**
     *
     * @param msg the error message
     * @param cause the original exception cause
     */
    public DeletionNotAllowedException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
