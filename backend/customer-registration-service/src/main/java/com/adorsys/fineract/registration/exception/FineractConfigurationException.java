package com.adorsys.fineract.registration.exception;

public class FineractConfigurationException extends RuntimeException {

    public FineractConfigurationException(String message) {
        super(message);
    }

    public FineractConfigurationException(String message, Throwable cause) {
        super(message, cause);
    }
}
