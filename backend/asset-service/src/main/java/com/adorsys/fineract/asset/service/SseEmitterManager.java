package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.event.OrderStatusChangedEvent;
import com.adorsys.fineract.asset.exception.AssetException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Manages SSE (Server-Sent Events) connections for real-time order status updates.
 * Clients subscribe to a specific order ID and receive push notifications on
 * every status transition. Auto-closes on terminal statuses.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SseEmitterManager {

    private static final long SSE_TIMEOUT = 120_000L; // 2 minutes
    private static final int MAX_CONNECTIONS_PER_USER = 5;
    private static final Set<OrderStatus> TERMINAL_STATUSES = Set.of(
            OrderStatus.FILLED, OrderStatus.FAILED, OrderStatus.REJECTED, OrderStatus.CANCELLED);

    private final ObjectMapper objectMapper;
    private final ConcurrentHashMap<String, List<SseEmitter>> emitters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicInteger> userConnectionCount = new ConcurrentHashMap<>();

    /**
     * Register a new SSE emitter for an order. Sends an initial "connected" event.
     * Enforces a per-user connection cap of {@value #MAX_CONNECTIONS_PER_USER}.
     * Auto-removes on timeout, completion, or error.
     */
    public SseEmitter subscribe(String orderId, String userId) {
        AtomicInteger counter = userConnectionCount.computeIfAbsent(userId, k -> new AtomicInteger(0));
        if (counter.get() >= MAX_CONNECTIONS_PER_USER) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Maximum SSE connections per user exceeded");
        }
        counter.incrementAndGet();

        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        emitters.computeIfAbsent(orderId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        Runnable cleanup = () -> {
            List<SseEmitter> list = emitters.get(orderId);
            if (list != null) {
                list.remove(emitter);
                if (list.isEmpty()) emitters.remove(orderId);
            }
            counter.decrementAndGet();
        };
        emitter.onCompletion(cleanup);
        emitter.onTimeout(cleanup);
        emitter.onError(e -> cleanup.run());

        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("{\"orderId\":\"" + orderId + "\"}"));
        } catch (IOException e) {
            emitter.completeWithError(e);
        }

        return emitter;
    }

    /**
     * Listen for order status changes and push to all connected SSE clients for that order.
     * Auto-completes the emitter on terminal statuses.
     */
    @Async
    @EventListener
    public void onOrderStatusChanged(OrderStatusChangedEvent event) {
        List<SseEmitter> list = emitters.get(event.orderId());
        if (list == null || list.isEmpty()) return;

        String json;
        try {
            json = objectMapper.writeValueAsString(event);
        } catch (Exception e) {
            log.error("Failed to serialize OrderStatusChangedEvent for SSE: {}", e.getMessage());
            return;
        }

        boolean isTerminal = TERMINAL_STATUSES.contains(event.newStatus());

        for (SseEmitter emitter : list) {
            try {
                emitter.send(SseEmitter.event()
                        .name("order-status")
                        .data(json));
                if (isTerminal) {
                    emitter.complete();
                }
            } catch (IOException e) {
                emitter.completeWithError(e);
            }
        }

        if (isTerminal) {
            emitters.remove(event.orderId());
        }
    }
}
