package com.adorsys.fineract.asset.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.math.BigDecimal;

/**
 * Strips trailing zeros from BigDecimal values in JSON responses.
 * e.g. 89.00000000 → 89, 1.50000000 → 1.5
 *
 * Registered as a Module bean so Spring Boot auto-configuration picks it up
 * without displacing other modules (e.g. JavaTimeModule for Instant support).
 */
@Configuration
public class JacksonConfig {

    @Bean
    public Module bigDecimalModule() {
        SimpleModule module = new SimpleModule("BigDecimalStripTrailingZeros");
        module.addSerializer(BigDecimal.class, new JsonSerializer<>() {
            @Override
            public void serialize(BigDecimal value, JsonGenerator gen, SerializerProvider serializers)
                    throws IOException {
                gen.writeNumber(value.stripTrailingZeros().toPlainString());
            }
        });
        return module;
    }
}
