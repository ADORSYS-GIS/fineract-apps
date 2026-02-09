package com.adorsys.fineract.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.retry.annotation.EnableRetry;

/**
 * Payment Gateway Service Application
 *
 * Provides integration with MTN Mobile Money and Orange Money payment providers
 * for deposit and withdrawal operations in Fineract.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
@EnableRetry
public class PaymentGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentGatewayApplication.class, args);
    }
}
