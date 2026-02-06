package com.adorsys.fineract.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Payment Gateway Service Application
 *
 * Provides integration with MTN Mobile Money and Orange Money payment providers
 * for deposit and withdrawal operations in Fineract.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class PaymentGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentGatewayApplication.class, args);
    }
}
