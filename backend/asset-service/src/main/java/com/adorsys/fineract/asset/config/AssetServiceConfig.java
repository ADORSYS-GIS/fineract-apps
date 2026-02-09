package com.adorsys.fineract.asset.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Asset service-specific configuration properties.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "asset-service")
public class AssetServiceConfig {

    private MarketHours marketHours = new MarketHours();
    private Pricing pricing = new Pricing();
    private Orders orders = new Orders();
    private TradeLock tradeLock = new TradeLock();
    private Accounting accounting = new Accounting();

    @Data
    public static class MarketHours {
        private String open = "08:00";
        private String close = "20:00";
        private String timezone = "Africa/Lagos";
        private boolean weekendTradingEnabled = false;
    }

    @Data
    public static class Pricing {
        private String snapshotCron = "0 0 * * * *";
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
        private Long feeIncomeGlAccountId = 87L;
        private Long cashGlAccountId = 1L;
    }
}
