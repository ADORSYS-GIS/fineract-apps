package com.adorsys.fineract.registration.exception;

public class FineractApiException extends RuntimeException {
    public FineractApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
