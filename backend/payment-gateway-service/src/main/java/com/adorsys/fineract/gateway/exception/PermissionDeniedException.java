package com.adorsys.fineract.gateway.exception;

/**
 * Thrown when a user attempts to access a resource they don't own.
 */
public class PermissionDeniedException extends RuntimeException {

    private final String errorCode;

    public PermissionDeniedException(String message) {
        super(message);
        this.errorCode = "PERMISSION_DENIED";
    }

    public String getErrorCode() {
        return errorCode;
    }
}
