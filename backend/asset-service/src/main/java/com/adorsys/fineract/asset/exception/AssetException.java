package com.adorsys.fineract.asset.exception;

public class AssetException extends RuntimeException {

    private final String errorCode;

    public AssetException(String message) {
        super(message);
        this.errorCode = null;
    }

    public AssetException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = null;
    }

    public AssetException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
