package com.adorsys.fineract.registration.exception;

import lombok.Getter;

@Getter
public class RegistrationException extends RuntimeException {

    private final String errorCode;
    private final String field;

    public RegistrationException(String message) {
        super(message);
        this.errorCode = "REGISTRATION_FAILED";
        this.field = null;
    }

    public RegistrationException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.field = null;
    }

    public RegistrationException(String errorCode, String message, String field) {
        super(message);
        this.errorCode = errorCode;
        this.field = field;
    }

    public RegistrationException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "REGISTRATION_FAILED";
        this.field = null;
    }
}
