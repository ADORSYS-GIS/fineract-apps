package com.adorsys.fineract.gateway.exception;

/**
 * Thrown when a required identity claim is missing or invalid in the JWT.
 */
public class IdentityClaimException extends RuntimeException {

    private final String errorCode;

    public IdentityClaimException(String message) {
        super(message);
        this.errorCode = "IDENTITY_CLAIM_MISSING";
    }

    public String getErrorCode() {
        return errorCode;
    }
}
