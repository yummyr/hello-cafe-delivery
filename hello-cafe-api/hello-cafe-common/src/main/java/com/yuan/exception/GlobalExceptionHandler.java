package com.yuan.exception;

import com.yuan.constant.MessageConstant;
import com.yuan.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.ClientAbortException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.sql.SQLIntegrityConstraintViolationException;


/**
 * Global handler for validation and business exceptions.
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handle general business exception
     * @param ex
     * @return
     */
    @ExceptionHandler
    public Result exceptionHandler(BaseException ex){
        log.error("invalid info:{}",ex.getMessage());
        return Result.error(ex.getMessage());
    }

    @ExceptionHandler(ClientAbortException.class)
    public void handleClientAbortException(ClientAbortException ex) {
        log.warn("Client closed connection early: {}", ex.getMessage());
    }


    /**
     * Handle SQL constraint violations (e.g., duplicate key)
     */
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public Result handleSQLIntegrityException(SQLIntegrityConstraintViolationException ex) {
        log.error("SQL constraint error: {}", ex.getMessage());
        String message = ex.getMessage();

        if (message != null && message.contains("Duplicate entry")) {
            // e.g., "Duplicate entry 'admin' for key 'username'"
            String[] split = message.split(" ");
            String value =split[2];
            return Result.error(value + " " + MessageConstant.ALREADY_EXISTS);
        }

        return Result.error(MessageConstant.UNKNOWN_ERROR);
    }

    /**
     * Handle general DataIntegrityViolationException from Spring
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public Result handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.error("Data integrity violation: {}", ex.getMessage());
        return Result.error(MessageConstant.DATABASE_ERROR);
    }

    /**
     * Catch all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public Result handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return Result.error(MessageConstant.UNKNOWN_ERROR);
    }
}
