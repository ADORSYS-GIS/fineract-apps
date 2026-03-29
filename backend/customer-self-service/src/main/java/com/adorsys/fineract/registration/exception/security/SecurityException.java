package com.adorsys.fineract.registration.exception.security;

import lombok.Getter;

@Getter
public class SecurityException extends RuntimeException {

    private final String errorCode;
    private final String field;

    public SecurityException(String message) {
        super(message);
        this.errorCode = "SECURITY_ERROR";
        this.field = null;
    }

    public SecurityException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.field = null;
    }

    public SecurityException(String errorCode, String message, String field) {
        super(message);
        this.errorCode = errorCode;
        this.field = field;
    }

    public SecurityException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "SECURITY_ERROR";
        this.field = null;
    }
}
