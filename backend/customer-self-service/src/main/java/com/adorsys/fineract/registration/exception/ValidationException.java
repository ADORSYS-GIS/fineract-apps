package com.adorsys.fineract.registration.exception;
import lombok.Getter;

@Getter
public class ValidationException extends RuntimeException {

    private final String errorCode;
    private final String field;

    public ValidationException(String message) {
        super(message);
        this.errorCode = "VALIDATION_ERROR";
        this.field = null;
    }

    public ValidationException(String message, String field) {
        super(message);
        this.errorCode = "VALIDATION_ERROR";
        this.field = field;
    }
}
