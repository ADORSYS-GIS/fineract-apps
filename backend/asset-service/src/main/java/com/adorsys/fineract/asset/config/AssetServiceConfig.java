package com.adorsys.fineract.asset.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.ZoneId;

/**
 * Asset service-specific configuration properties.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "asset-service")
public class AssetServiceConfig {

    /** ISO 4217 currency code for the settlement/cash currency. */
    private String settlementCurrency = "XAF";

    private MarketHours marketHours = new MarketHours();
    private Pricing pricing = new Pricing();
    private Orders orders = new Orders();
    private TradeLock tradeLock = new TradeLock();
    private Accounting accounting = new Accounting();
    private GlAccounts glAccounts = new GlAccounts();

    @Data
    public static class MarketHours {
        private String open = "08:00";
        private String close = "20:00";
        private String timezone = "Africa/Douala";
        private boolean weekendTradingEnabled = false;
    }

    @Data
    public static class Pricing {
        private String snapshotCron = "0 0 * * * *";
        /** Max price change percent before a warning is logged. Null to disable. */
        private BigDecimal maxChangePercent = new BigDecimal("50");
    }

    @Data
    public static class Orders {
        private int staleCleanupMinutes = 30;
    }

    @Data
    public static class TradeLock {
        private int ttlSeconds = 10;
    }

    @Data
    public static class Accounting {
        private Long feeCollectionAccountId;
        /** Optional. If set, spread is enabled and swept to this account. If null, spread is disabled. */
        private Long spreadCollectionAccountId;
    }

    @Data
    public static class GlAccounts {
        private Long digitalAssetInventory = 47L;
        private Long customerDigitalAssetHoldings = 65L;
        private Long assetIssuancePaymentType = 22L;
    }

    @PostConstruct
    public void validate() {
        if (accounting.getFeeCollectionAccountId() == null || accounting.getFeeCollectionAccountId() <= 0) {
            throw new IllegalStateException(
                    "asset-service.accounting.fee-collection-account-id must be set to a valid Fineract savings account ID. "
                    + "Current value: " + accounting.getFeeCollectionAccountId());
        }
        if (settlementCurrency == null || !settlementCurrency.matches("[A-Z]{3}")) {
            throw new IllegalStateException(
                    "asset-service.settlement-currency must be a 3-letter ISO 4217 currency code. "
                    + "Current value: '" + settlementCurrency + "'");
        }
        try {
            ZoneId.of(marketHours.getTimezone());
        } catch (Exception e) {
            throw new IllegalStateException(
                    "asset-service.market-hours.timezone is invalid: '" + marketHours.getTimezone()
                    + "'. Must be a valid IANA timezone (e.g. 'Africa/Douala').", e);
        }
    }
}
