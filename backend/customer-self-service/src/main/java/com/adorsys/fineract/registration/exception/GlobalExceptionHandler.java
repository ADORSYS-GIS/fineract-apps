package com.adorsys.fineract.registration.exception;

import com.adorsys.fineract.registration.exception.security.SecurityException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.access.AccessDeniedException;
 
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String VALIDATION_ERROR = "VALIDATION_ERROR";

    @ExceptionHandler(RegistrationException.class)
    public ResponseEntity<ErrorResponse> handleRegistrationException(RegistrationException ex) {
        String correlationId = UUID.randomUUID().toString();
        log.error("Registration error [correlationId={}]: {}", correlationId, ex.getMessage(), ex);

        ErrorResponse response = ErrorResponse.builder()
                .error(ex.getErrorCode())
                .message(ex.getMessage())
                .field(ex.getField())
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();

        HttpStatus status = switch (ex.getErrorCode()) {
            case "EMAIL_ALREADY_EXISTS", "PHONE_ALREADY_EXISTS", "INVALID_PHONE", VALIDATION_ERROR -> HttpStatus.BAD_REQUEST;
            case "NOT_FOUND" -> HttpStatus.NOT_FOUND;
            case "FORBIDDEN" -> HttpStatus.FORBIDDEN;
            case "CONFLICT", "DUPLICATE_PHONE" -> HttpStatus.CONFLICT;
            case "UNAUTHORIZED" -> HttpStatus.UNAUTHORIZED;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        String firstField = errors.keySet().iterator().next();
        String firstError = errors.get(firstField);

        ErrorResponse response = ErrorResponse.builder()
                .error(VALIDATION_ERROR)
                .message(firstError)
                .field(firstField)
                .validationErrors(errors)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.badRequest().body(response);
    }
 
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        String correlationId = UUID.randomUUID().toString();
        log.warn("Access denied [correlationId={}]: {}", correlationId, ex.getMessage());
 
        ErrorResponse response = ErrorResponse.builder()
                .error("FORBIDDEN")
                .message("You do not have the required permissions to perform this action.")
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();
 
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
 
    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<ErrorResponse> handleMissingHeaderException(MissingRequestHeaderException ex) {
        String correlationId = UUID.randomUUID().toString();
        log.warn("Missing required header [correlationId={}]: {}", correlationId, ex.getMessage());

        ErrorResponse response = ErrorResponse.builder()
                .error(VALIDATION_ERROR)
                .message(ex.getMessage())
                .field(ex.getHeaderName())
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        String correlationId = UUID.randomUUID().toString();
        log.error("Unexpected error [correlationId={}]: {}", correlationId, ex.getMessage(), ex);

        ErrorResponse response = ErrorResponse.builder()
                .error("INTERNAL_ERROR")
                .message("An unexpected error occurred. Please try again.")
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ErrorResponse> handleSecurityException(SecurityException ex) {
        String correlationId = UUID.randomUUID().toString();
        log.warn("Security error [correlationId={}]: {}", correlationId, ex.getMessage(), ex);

        ErrorResponse response = ErrorResponse.builder()
                .error(ex.getErrorCode())
                .message(ex.getMessage())
                .field(ex.getField())
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();

        HttpStatus status = switch (ex.getErrorCode()) {
            case "IDENTITY_CLAIM_MISSING" -> HttpStatus.UNAUTHORIZED;
            default -> HttpStatus.FORBIDDEN;
        };

        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex) {
        String correlationId = UUID.randomUUID().toString();
        log.warn("Validation error [correlationId={}]: {}", correlationId, ex.getMessage(), ex);

        ErrorResponse response = ErrorResponse.builder()
                .error(ex.getErrorCode())
                .message(ex.getMessage())
                .field(ex.getField())
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(IdempotencyException.class)
    public ResponseEntity<ErrorResponse> handleIdempotencyException(IdempotencyException ex) {
        String correlationId = UUID.randomUUID().toString();
        log.warn("Idempotency error [correlationId={}]: {}", correlationId, ex.getMessage(), ex);

        ErrorResponse response = ErrorResponse.builder()
                .error("IDEMPOTENCY_ERROR")
                .message(ex.getMessage())
                .correlationId(correlationId)
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }


    @Data
    @Builder
    @AllArgsConstructor
    public static class ErrorResponse {
        private String error;
        private String message;
        private String field;
        private String correlationId;
        private Instant timestamp;
        private Map<String, String> validationErrors;
    }
}
