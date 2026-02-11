package com.adorsys.fineract.asset.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for REST controllers.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AssetNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAssetNotFound(AssetNotFoundException ex) {
        log.warn("Asset not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("NOT_FOUND", ex.getMessage(), "NOT_FOUND", Instant.now()));
    }

    @ExceptionHandler(AssetException.class)
    public ResponseEntity<ErrorResponse> handleAssetException(AssetException ex) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("already exists")) {
            status = HttpStatus.CONFLICT;
        }
        log.error("Asset error [{}]: {}", status, ex.getMessage());
        return ResponseEntity.status(status)
                .body(new ErrorResponse("ASSET_ERROR", ex.getMessage(), ex.getErrorCode(), Instant.now()));
    }

    @ExceptionHandler(TradingException.class)
    public ResponseEntity<ErrorResponse> handleTradingException(TradingException ex) {
        HttpStatus status = switch (ex.getErrorCode()) {
            case "NO_XAF_ACCOUNT", "NO_POSITION", "INSUFFICIENT_UNITS", "INSUFFICIENT_FUNDS" -> HttpStatus.UNPROCESSABLE_ENTITY;
            case "TRADE_FAILED" -> HttpStatus.BAD_GATEWAY;
            case "CONFIG_ERROR" -> HttpStatus.INTERNAL_SERVER_ERROR;
            default -> HttpStatus.BAD_REQUEST;
        };
        log.error("Trading error [{}]: {}", status, ex.getMessage());
        return ResponseEntity.status(status)
                .body(new ErrorResponse(ex.getErrorCode(), ex.getMessage(), ex.getErrorCode(), Instant.now()));
    }

    @ExceptionHandler(MarketClosedException.class)
    public ResponseEntity<ErrorResponse> handleMarketClosed(MarketClosedException ex) {
        log.warn("Market closed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("MARKET_CLOSED", ex.getMessage(), "MARKET_CLOSED", Instant.now()));
    }

    @ExceptionHandler(TradingHaltedException.class)
    public ResponseEntity<ErrorResponse> handleTradingHalted(TradingHaltedException ex) {
        log.warn("Trading halted: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("TRADING_HALTED", ex.getMessage(), "TRADING_HALTED", Instant.now()));
    }

    @ExceptionHandler(InsufficientInventoryException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientInventory(InsufficientInventoryException ex) {
        log.warn("Insufficient inventory: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("INSUFFICIENT_INVENTORY", ex.getMessage(), "INSUFFICIENT_INVENTORY", Instant.now()));
    }

    @ExceptionHandler(TradeLockException.class)
    public ResponseEntity<ErrorResponse> handleTradeLock(TradeLockException ex) {
        log.warn("Trade lock: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(new ErrorResponse("TRADE_LOCKED", ex.getMessage(), "TRADE_LOCKED", Instant.now()));
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<ErrorResponse> handleMissingHeader(MissingRequestHeaderException ex) {
        log.warn("Missing request header: {}", ex.getHeaderName());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("MISSING_HEADER", ex.getMessage(), "MISSING_HEADER", Instant.now()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("VALIDATION_ERROR", "Validation failed", null, Instant.now(), errors));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse("ACCESS_DENIED", "You don't have permission to perform this action", null, Instant.now()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred", null, Instant.now()));
    }

    public record ErrorResponse(
            String error,
            String message,
            String code,
            Instant timestamp,
            Map<String, String> details
    ) {
        public ErrorResponse(String error, String message, String code, Instant timestamp) {
            this(error, message, code, timestamp, null);
        }
    }
}
