package com.adorsys.fineract.asset;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Asset Service Application.
 *
 * Provides a tokenized asset marketplace middleware for Apache Fineract.
 * Assets are modeled as custom currencies in Fineract savings accounts.
 * A company treasury acts as the sole market maker, placing standing
 * buy/sell orders at various price levels.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
public class AssetServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AssetServiceApplication.class, args);
    }
}
