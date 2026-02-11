package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.MarketStatusResponse;
import com.adorsys.fineract.asset.exception.MarketClosedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Enforces market trading hours: 8:00 AM - 8:00 PM WAT (Africa/Lagos).
 * Provides market status with countdown timers.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MarketHoursService {

    private final AssetServiceConfig config;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("h:mm a", Locale.US);

    /**
     * Assert the market is currently open. Throws MarketClosedException if not.
     */
    public void assertMarketOpen() {
        if (!isMarketOpen()) {
            MarketStatusResponse status = getMarketStatus();
            throw new MarketClosedException(
                    String.format("Market is closed. Opens in %d seconds. Schedule: %s",
                            status.secondsUntilOpen(), status.schedule()));
        }
    }

    /**
     * Check if the market is currently open.
     */
    public boolean isMarketOpen() {
        ZoneId zone = getTimezone();
        ZonedDateTime now = ZonedDateTime.now(zone);

        if (isWeekend(now) && !config.getMarketHours().isWeekendTradingEnabled()) {
            return false;
        }

        LocalTime openTime = LocalTime.parse(config.getMarketHours().getOpen());
        LocalTime closeTime = LocalTime.parse(config.getMarketHours().getClose());
        LocalTime currentTime = now.toLocalTime();

        return !currentTime.isBefore(openTime) && currentTime.isBefore(closeTime);
    }

    /**
     * Get market status with schedule and countdown timers.
     */
    public MarketStatusResponse getMarketStatus() {
        ZoneId zone = getTimezone();
        ZonedDateTime now = ZonedDateTime.now(zone);
        LocalTime openTime = LocalTime.parse(config.getMarketHours().getOpen());
        LocalTime closeTime = LocalTime.parse(config.getMarketHours().getClose());

        boolean isOpen = isMarketOpen();
        String schedule = openTime.format(TIME_FMT) + " - " + closeTime.format(TIME_FMT) + " WAT";

        long secondsUntilClose = 0;
        long secondsUntilOpen = 0;

        if (isOpen) {
            ZonedDateTime closeToday = now.toLocalDate().atTime(closeTime).atZone(zone);
            secondsUntilClose = Duration.between(now, closeToday).getSeconds();
        } else {
            ZonedDateTime nextOpen;
            if (now.toLocalTime().isBefore(openTime)) {
                nextOpen = now.toLocalDate().atTime(openTime).atZone(zone);
            } else {
                nextOpen = now.toLocalDate().plusDays(1).atTime(openTime).atZone(zone);
            }
            // Skip weekends if not enabled
            if (!config.getMarketHours().isWeekendTradingEnabled()) {
                while (isWeekend(nextOpen)) {
                    nextOpen = nextOpen.plusDays(1);
                }
            }
            secondsUntilOpen = Duration.between(now, nextOpen).getSeconds();
        }

        return new MarketStatusResponse(isOpen, schedule, secondsUntilClose, secondsUntilOpen, zone.getId());
    }

    private boolean isWeekend(ZonedDateTime dateTime) {
        DayOfWeek day = dateTime.getDayOfWeek();
        return day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY;
    }

    private ZoneId getTimezone() {
        return ZoneId.of(config.getMarketHours().getTimezone());
    }
}
