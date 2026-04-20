package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.MarketStatusResponse;
import com.adorsys.fineract.asset.exception.MarketClosedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MarketHoursServiceTest {

    @Mock private AssetServiceConfig config;

    @InjectMocks
    private MarketHoursService marketHoursService;

    private AssetServiceConfig.MarketHours marketHours;

    private static final ZoneId WAT = ZoneId.of("Africa/Douala");

    @BeforeEach
    void setUp() {
        marketHours = new AssetServiceConfig.MarketHours();
        marketHours.setOpen("08:00");
        marketHours.setClose("20:00");
        marketHours.setTimezone("Africa/Douala");
        marketHours.setWeekendTradingEnabled(false);
    }

    private void fixClockAt(LocalDateTime watTime) {
        Instant instant = watTime.atZone(WAT).toInstant();
        marketHoursService.setClock(Clock.fixed(instant, WAT));
    }

    // -------------------------------------------------------------------------
    // isMarketOpen tests
    // -------------------------------------------------------------------------

    @Test
    void isMarketOpen_duringMarketHours_returnsTrue() {
        // Fix clock to noon WAT on a Wednesday
        fixClockAt(LocalDateTime.of(2026, 3, 25, 12, 0));
        marketHours.setOpen("00:00");
        marketHours.setClose("23:59");
        marketHours.setWeekendTradingEnabled(true);
        when(config.getMarketHours()).thenReturn(marketHours);

        boolean open = marketHoursService.isMarketOpen();

        assertTrue(open);
    }

    @Test
    void isMarketOpen_outsideMarketHours_returnsFalse() {
        // Fix clock to 15:00 WAT — outside the 00:00-00:01 window
        fixClockAt(LocalDateTime.of(2026, 3, 25, 15, 0));
        marketHours.setOpen("00:00");
        marketHours.setClose("00:01");
        marketHours.setWeekendTradingEnabled(true);
        when(config.getMarketHours()).thenReturn(marketHours);

        boolean open = marketHoursService.isMarketOpen();

        assertFalse(open);
    }

    // -------------------------------------------------------------------------
    // assertMarketOpen tests
    // -------------------------------------------------------------------------

    @Test
    void assertMarketOpen_whenOpen_doesNotThrow() {
        // Fix clock to noon WAT on a Wednesday
        fixClockAt(LocalDateTime.of(2026, 3, 25, 12, 0));
        marketHours.setOpen("00:00");
        marketHours.setClose("23:59");
        marketHours.setWeekendTradingEnabled(true);
        when(config.getMarketHours()).thenReturn(marketHours);

        assertDoesNotThrow(() -> marketHoursService.assertMarketOpen());
    }

    @Test
    void assertMarketOpen_whenClosed_throwsMarketClosedException() {
        // Fix clock to 15:00 WAT — outside the 00:00-00:01 window
        fixClockAt(LocalDateTime.of(2026, 3, 25, 15, 0));
        marketHours.setOpen("00:00");
        marketHours.setClose("00:01");
        marketHours.setWeekendTradingEnabled(true);
        when(config.getMarketHours()).thenReturn(marketHours);

        MarketClosedException ex = assertThrows(
                MarketClosedException.class,
                () -> marketHoursService.assertMarketOpen());
        assertTrue(ex.getMessage().contains("Market is closed"));
        assertTrue(ex.getMessage().contains("Opens in"));
    }

    // -------------------------------------------------------------------------
    // getMarketStatus tests
    // -------------------------------------------------------------------------

    @Test
    void getMarketStatus_returnsCorrectFields() {
        // Fix clock to 14:00 WAT on a Wednesday (within default 08:00-20:00)
        fixClockAt(LocalDateTime.of(2026, 3, 25, 14, 0));
        marketHours.setWeekendTradingEnabled(true);
        when(config.getMarketHours()).thenReturn(marketHours);

        MarketStatusResponse status = marketHoursService.getMarketStatus();

        assertNotNull(status);
        assertNotNull(status.schedule());
        assertTrue(status.schedule().contains("WAT"));
        assertTrue(status.schedule().contains("AM"));
        assertTrue(status.schedule().contains("PM"));

        assertEquals("Africa/Douala", status.timezone());

        if (status.isOpen()) {
            assertTrue(status.secondsUntilClose() > 0);
            assertEquals(0, status.secondsUntilOpen());
        } else {
            assertTrue(status.secondsUntilOpen() > 0);
            assertEquals(0, status.secondsUntilClose());
        }
    }
}
