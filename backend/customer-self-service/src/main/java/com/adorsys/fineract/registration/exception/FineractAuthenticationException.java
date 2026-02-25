package com.adorsys.fineract.registration.exception;

public class FineractAuthenticationException extends RuntimeException {

    public FineractAuthenticationException(String message) {
        super(message);
    }

    public FineractAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}
