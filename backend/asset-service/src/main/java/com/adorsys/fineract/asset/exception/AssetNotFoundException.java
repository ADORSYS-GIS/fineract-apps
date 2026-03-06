package com.adorsys.fineract.asset.exception;

public class AssetNotFoundException extends AssetException {

    public AssetNotFoundException(String message) {
        super(message, "NOT_FOUND");
    }
}
