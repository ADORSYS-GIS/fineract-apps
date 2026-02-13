package com.adorsys.fineract.asset.exception;

public class InsufficientInventoryException extends TradingException {

    public InsufficientInventoryException(String message) {
        super(message, "INSUFFICIENT_INVENTORY");
    }

    public InsufficientInventoryException(String assetId, java.math.BigDecimal requested, java.math.BigDecimal available) {
        super(String.format("Insufficient inventory for asset %s: requested %s units but only %s available",
                assetId, requested.toPlainString(), available.toPlainString()), "INSUFFICIENT_INVENTORY");
    }
}
