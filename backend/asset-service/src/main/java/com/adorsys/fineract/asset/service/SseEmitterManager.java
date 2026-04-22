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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
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
    private static final long STALE_THRESHOLD_MILLIS = SSE_TIMEOUT * 3; // 6 minutes
    private static final int MAX_EMITTERS_PER_USER = 5;
    private static final int MAX_CONNECTIONS_PER_USER = MAX_EMITTERS_PER_USER;
    private static final Set<OrderStatus> TERMINAL_STATUSES = Set.of(
            OrderStatus.FILLED, OrderStatus.FAILED, OrderStatus.REJECTED, OrderStatus.CANCELLED);

    private final ObjectMapper objectMapper;
    private final ConcurrentHashMap<String, List<SseEmitter>> emitters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<SseEmitter, Long> emitterCreationTimes = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicInteger> userConnectionCount = new ConcurrentHashMap<>();

    /**
     * Register a new SSE emitter for an order. Sends an initial "connected" event.
     * Enforces a per-user connection cap of {@value #MAX_CONNECTIONS_PER_USER}.
     * Auto-removes on timeout, completion, or error.
     * <p>
     * The cap-enforce and list.add run atomically inside {@code emitters.compute} so that two
     * concurrent subscribes cannot both pass the cap check and both add, which would exceed
     * {@code MAX_EMITTERS_PER_USER}. Lifecycle callbacks are registered after compute returns
     * because calling emitter methods inside a compute lambda would risk deadlock.
     */
    public SseEmitter subscribe(String orderId, String userId) {
        AtomicInteger counter = userConnectionCount.computeIfAbsent(userId, k -> new AtomicInteger(0));
        if (counter.get() >= MAX_CONNECTIONS_PER_USER) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Maximum SSE connections per user exceeded");
        }
        counter.incrementAndGet();

        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        emitterCreationTimes.put(emitter, System.currentTimeMillis());

        // Atomically evict oldest emitters (if at cap) and add the new one.
        emitters.compute(orderId, (key, existing) -> {
            List<SseEmitter> list = (existing != null) ? existing : new CopyOnWriteArrayList<>();
            while (list.size() >= MAX_EMITTERS_PER_USER) {
                SseEmitter oldest = list.stream()
                        .min(Comparator.comparingLong(e -> emitterCreationTimes.getOrDefault(e, Long.MAX_VALUE)))
                        .orElse(null);
                if (oldest == null) break;
                list.remove(oldest);
                emitterCreationTimes.remove(oldest);
                oldest.complete();
            }
            list.add(emitter);
            return list;
        });

        // Register lifecycle callbacks outside compute to avoid re-entrant map access.
        Runnable cleanup = () -> {
            List<SseEmitter> current = emitters.get(orderId);
            if (current != null) {
                current.remove(emitter);
                if (current.isEmpty()) emitters.remove(orderId);
            }
            emitterCreationTimes.remove(emitter);
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

    /**
     * Evict emitters that have exceeded 3× the SSE timeout without a network-level close signal.
     */
    @Scheduled(fixedDelay = 60_000)
    public void evictStaleEmitters() {
        long cutoff = System.currentTimeMillis() - STALE_THRESHOLD_MILLIS;
        emitters.forEach((orderId, list) -> {
            list.removeIf(emitter -> {
                Long created = emitterCreationTimes.get(emitter);
                if (created != null && created < cutoff) {
                    emitter.complete();
                    emitterCreationTimes.remove(emitter);
                    return true;
                }
                return false;
            });
            if (list.isEmpty()) emitters.remove(orderId);
        });
    }


}
