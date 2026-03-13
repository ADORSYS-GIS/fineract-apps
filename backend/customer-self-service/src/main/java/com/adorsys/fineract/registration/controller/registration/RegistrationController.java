package com.adorsys.fineract.registration.controller.registration;

import com.adorsys.fineract.registration.dto.deposit.DepositRequest;
import com.adorsys.fineract.registration.dto.deposit.DepositResponse;
import com.adorsys.fineract.registration.dto.registration.ClientAndAccountResponse;
import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.service.registration.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/registration")
@RequiredArgsConstructor
@Tag(name = "Registration", description = "Customer registration and status APIs")
@SecurityRequirement(name = "bearer-jwt")
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/register")
    @Operation(summary = "Register a new customer and create a savings account",
            description = "Creates a client and a savings account in Fineract for self-service customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Registration successful",
                    content = @Content(schema = @Schema(implementation = ClientAndAccountResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error or email already exists"),
            @ApiResponse(responseCode = "500", description = "Registration failed")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ClientAndAccountResponse> register(
            @Valid @RequestBody RegistrationRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        ClientAndAccountResponse response = registrationService.registerClientAndAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/approve-and-deposit")
    @Operation(summary = "Fund a customer's savings account",
            description = "Approves, activates, and deposits funds into a customer's savings account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deposit successful",
                    content = @Content(schema = @Schema(implementation = DepositResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "500", description = "Deposit failed")
    })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DepositResponse> approveAndDeposit(
            @RequestHeader(value = "X-Idempotency-Key", required = true) String idempotencyKey,
            @Valid @RequestBody DepositRequest request) {
        log.info("Received deposit request for savings account: {}", request.getSavingsAccountId());
        if (!StringUtils.hasText(idempotencyKey)) {
            throw new RegistrationException("VALIDATION_ERROR", "X-Idempotency-Key header must not be blank.", "X-Idempotency-Key");
        }
        try {
            UUID.fromString(idempotencyKey);
        } catch (IllegalArgumentException e) {
            throw new RegistrationException("VALIDATION_ERROR", "X-Idempotency-Key header must be a valid UUID.", "X-Idempotency-Key");
        }
        log.debug("Deposit request payload: {}", request);
        DepositResponse response = registrationService.fundAccount(request, idempotencyKey);
        return ResponseEntity.ok(response);
    }
}
