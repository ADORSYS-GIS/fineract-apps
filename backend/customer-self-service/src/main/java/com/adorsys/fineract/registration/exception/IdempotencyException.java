package com.adorsys.fineract.registration.exception;

import lombok.Getter;

@Getter
public class IdempotencyException extends RuntimeException {

    public IdempotencyException(String message) {
        super(message);
    }

    public IdempotencyException(String message, Throwable cause) {
        super(message, cause);
    }
}
