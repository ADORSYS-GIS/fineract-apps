package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.event.OrderStatusChangedEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.math.BigDecimal;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class SseEmitterManagerTest {

    private SseEmitterManager sseEmitterManager;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        sseEmitterManager = new SseEmitterManager(objectMapper);
    }

    @Test
    void subscribe_returnsEmitter() {
        SseEmitter emitter = sseEmitterManager.subscribe("order-001");

        assertNotNull(emitter);
    }

    @Test
    void onOrderStatusChanged_noSubscribers_doesNothing() {
        OrderStatusChangedEvent event = createEvent("order-999", OrderStatus.PENDING);

        // Should not throw
        assertDoesNotThrow(() -> sseEmitterManager.onOrderStatusChanged(event));
    }

    @Test
    void onOrderStatusChanged_terminalStatus_completesEmitter() {
        SseEmitter emitter = sseEmitterManager.subscribe("order-001");
        assertNotNull(emitter);

        OrderStatusChangedEvent event = createEvent("order-001", OrderStatus.FILLED);
        sseEmitterManager.onOrderStatusChanged(event);

        // After terminal status, subscribing again should give a fresh emitter (old one completed)
        // The internal map should have been cleaned up
        SseEmitter newEmitter = sseEmitterManager.subscribe("order-001");
        assertNotNull(newEmitter);
    }

    @Test
    void subscribe_multipleEmitters_forSameOrder() {
        SseEmitter emitter1 = sseEmitterManager.subscribe("order-001");
        SseEmitter emitter2 = sseEmitterManager.subscribe("order-001");

        assertNotNull(emitter1);
        assertNotNull(emitter2);
        assertNotSame(emitter1, emitter2);
    }

    @Test
    void onOrderStatusChanged_nonTerminalStatus_doesNotComplete() {
        sseEmitterManager.subscribe("order-001");

        OrderStatusChangedEvent event = createEvent("order-001", OrderStatus.EXECUTING);

        // Should send without completing — no exception
        assertDoesNotThrow(() -> sseEmitterManager.onOrderStatusChanged(event));
    }

    private OrderStatusChangedEvent createEvent(String orderId, OrderStatus newStatus) {
        return new OrderStatusChangedEvent(
                orderId, 42L, "asset-001", "TST", TradeSide.BUY,
                OrderStatus.PENDING, newStatus,
                new BigDecimal("10"), new BigDecimal("100"), new BigDecimal("1000"),
                new BigDecimal("5"), null, Instant.now());
    }
}
