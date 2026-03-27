package com.adorsys.fineract.registration.exception.security;

public class IdentityClaimException extends SecurityException {

    public IdentityClaimException(String message) {
        super("IDENTITY_CLAIM_MISSING", message);
    }

    public IdentityClaimException(String message, String field) {
        super("IDENTITY_CLAIM_MISSING", message, field);
    }
}
