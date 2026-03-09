package com.adorsys.fineract.asset.config;

import io.micrometer.core.instrument.Meter;
import io.micrometer.core.instrument.config.MeterFilter;
import io.micrometer.core.instrument.distribution.DistributionStatisticConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class MetricsConfig {

    @Bean
    public MeterFilter httpServerHistogramFilter() {
        return new MeterFilter() {
            @Override
            public DistributionStatisticConfig configure(Meter.Id id, DistributionStatisticConfig config) {
                if (id.getName().startsWith("http.server.requests")) {
                    return DistributionStatisticConfig.builder()
                            .percentilesHistogram(true)
                            .percentiles(0.5, 0.95, 0.99)
                            .minimumExpectedValue(Duration.ofMillis(1).toNanos() * 1.0)
                            .maximumExpectedValue(Duration.ofSeconds(10).toNanos() * 1.0)
                            .build()
                            .merge(config);
                }
                return config;
            }
        };
    }

    /**
     * Enable histogram buckets for custom asset trade/quote timers so that
     * Grafana can compute percentiles via histogram_quantile().
     */
    @Bean
    public MeterFilter assetTradeHistogramFilter() {
        return new MeterFilter() {
            @Override
            public DistributionStatisticConfig configure(Meter.Id id, DistributionStatisticConfig config) {
                String name = id.getName();
                if (name.startsWith("asset.trades.") && name.endsWith(".duration")
                        || name.equals("asset.quotes.to_execution_duration")) {
                    return DistributionStatisticConfig.builder()
                            .percentilesHistogram(true)
                            .percentiles(0.5, 0.95, 0.99)
                            .minimumExpectedValue(Duration.ofMillis(10).toNanos() * 1.0)
                            .maximumExpectedValue(Duration.ofSeconds(30).toNanos() * 1.0)
                            .build()
                            .merge(config);
                }
                return config;
            }
        };
    }
}
