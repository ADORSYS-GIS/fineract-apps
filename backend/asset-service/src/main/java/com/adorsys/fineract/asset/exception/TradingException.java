package com.adorsys.fineract.asset.exception;

public class TradingException extends RuntimeException {

    private final String errorCode;

    public TradingException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public TradingException(String message) {
        super(message);
        this.errorCode = "TRADING_ERROR";
    }

    public String getErrorCode() {
        return errorCode;
    }
}
