package com.adorsys.fineract.asset.exception;

public class TradingHaltedException extends RuntimeException {

    public TradingHaltedException(String assetId) {
        super("Trading is halted for asset: " + assetId);
    }
}
