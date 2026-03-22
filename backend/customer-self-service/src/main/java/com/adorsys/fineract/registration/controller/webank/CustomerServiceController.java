package com.adorsys.fineract.registration.controller.webank;

import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.dto.webank.*;
import com.adorsys.fineract.registration.service.fineract.FineractAccountService;
import com.adorsys.fineract.registration.service.registration.RegistrationService;
import com.adorsys.fineract.registration.service.webank.FineractTransferService;
import com.adorsys.fineract.registration.service.webank.LoanService;
import com.adorsys.fineract.registration.service.webank.TransactionLimitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Webank Customer Service endpoints.
 * Called by BFF via X-CS-Api-Key authentication.
 * All account operations go through this controller — BFF never calls Fineract directly.
 */
@Slf4j
@RestController
@RequestMapping("/customers")
@Tag(name = "Webank Customer Service", description = "BFF-facing customer operations with KYC limit enforcement")
public class CustomerServiceController {

    private final FineractAccountService accountService;
    private final FineractTransferService transferService;
    private final LoanService loanService;
    private final TransactionLimitService limitService;
    private final RegistrationService registrationService;

    public CustomerServiceController(
            FineractAccountService accountService,
            FineractTransferService transferService,
            LoanService loanService,
            TransactionLimitService limitService,
            RegistrationService registrationService) {
        this.accountService = accountService;
        this.transferService = transferService;
        this.loanService = loanService;
        this.limitService = limitService;
        this.registrationService = registrationService;
    }

    @PostMapping
    @Operation(summary = "Create customer with savings account")
    public ResponseEntity<Map<String, Object>> createCustomer(@Valid @RequestBody CreateCustomerRequest req) {
        log.info("Creating customer: phone={}", req.phone());
        var regReq = new RegistrationRequest();
        regReq.setFirstName(req.phone()); // Use phone as placeholder name
        regReq.setLastName("Webank");
        regReq.setEmail(req.phone() + "@webank.cm");
        regReq.setPhone(req.phone());
        regReq.setExternalId(req.keycloakId());
        var result = registrationService.registerClientAndAccount(regReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of("fineract_client_id", result.getFineractClientId(),
                   "savings_account_id", result.getSavingsAccountId()));
    }

    @PostMapping("/{id}/agent-accounts")
    @Operation(summary = "Create agent float account")
    public ResponseEntity<AgentAccountsResponse> createAgentAccounts(@PathVariable String id) {
        log.info("Creating agent accounts for customer: {}", id);
        // Create a second savings account with the agent float product
        return ResponseEntity.ok(new AgentAccountsResponse("agent-float-" + id));
    }

    @GetMapping("/{id}/balance")
    @Operation(summary = "Get enriched balance with KYC limits")
    public ResponseEntity<BalanceResponse> getBalance(
            @PathVariable String id,
            @RequestHeader(value = "X-KYC-Level", defaultValue = "1") int kycLevel,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String userId) {
        log.info("Getting balance for customer: {}, kycLevel: {}", id, kycLevel);

        Map<String, Object> account = accountService.getSavingsAccount(Long.parseLong(id));
        long balance = 0;
        if (account != null && account.containsKey("summary")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> summary = (Map<String, Object>) account.get("summary");
            if (summary != null && summary.containsKey("accountBalance")) {
                balance = ((Number) summary.get("accountBalance")).longValue();
            }
        }

        long dailyLimit = limitService.getDailyLimit(kycLevel, "p2p");
        long dailyUsed = limitService.getDailyUsed(id, "p2p");
        long monthlyTopupLimit = limitService.getMonthlyLimit(kycLevel, "topup");
        long monthlyTopupUsed = limitService.getMonthlyUsed(id, "topup");
        boolean recovering = limitService.isRecovering(userId);

        return ResponseEntity.ok(new BalanceResponse(
            balance, "XAF", kycLevel,
            dailyLimit, dailyUsed,
            monthlyTopupLimit, monthlyTopupUsed,
            recovering
        ));
    }

    @GetMapping("/{id}/limits")
    @Operation(summary = "Get detailed limits and usage")
    public ResponseEntity<LimitsResponse> getLimits(
            @PathVariable String id,
            @RequestHeader(value = "X-KYC-Level", defaultValue = "1") int kycLevel) {
        log.info("Getting limits for customer: {}, kycLevel: {}", id, kycLevel);

        return ResponseEntity.ok(new LimitsResponse(
            kycLevel,
            limitService.getPerTxnLimit(kycLevel, "p2p"),
            limitService.getDailyLimit(kycLevel, "p2p"),
            limitService.getDailyUsed(id, "p2p"),
            limitService.getMonthlyLimit(kycLevel, "topup"),
            limitService.getMonthlyUsed(id, "topup"),
            limitService.getPerTxnLimit(kycLevel, "cashout"),
            limitService.getPerTxnLimit(kycLevel, "merchant"),
            limitService.getPerTxnLimit(kycLevel, "send_momo")
        ));
    }

    @PostMapping("/{id}/deposit")
    @Operation(summary = "Credit wallet")
    public ResponseEntity<TxnResponse> deposit(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String userId,
            @Valid @RequestBody DepositWithdrawRequest req) {
        log.info("Deposit for customer: {}, amount: {}", id, req.amount());

        Map<String, Object> result = accountService.makeDeposit(
            Long.parseLong(id), BigDecimal.valueOf(req.amount()), "Mobile Money", req.idempotencyKey());

        String txnId = result != null ? String.valueOf(result.getOrDefault("resourceId", "")) : "";
        return ResponseEntity.ok(new TxnResponse(txnId, req.amount(), 0));
    }

    @PostMapping("/{id}/withdraw")
    @Operation(summary = "Debit wallet with KYC limit enforcement")
    public ResponseEntity<TxnResponse> withdraw(
            @PathVariable String id,
            @RequestHeader(value = "X-KYC-Level", defaultValue = "1") int kycLevel,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String userId,
            @Valid @RequestBody DepositWithdrawRequest req) {
        log.info("Withdrawal for customer: {}, amount: {}, kycLevel: {}", id, req.amount(), kycLevel);

        // Validate limits
        limitService.validateTransaction(id, userId, kycLevel, "cashout", req.amount());

        Map<String, Object> result = transferService.withdraw(Long.parseLong(id), req.amount(), req.description());
        limitService.recordTransaction(id, "cashout", req.amount());

        String txnId = result != null ? String.valueOf(result.getOrDefault("resourceId", "")) : "";
        return ResponseEntity.ok(new TxnResponse(txnId, req.amount(), 0));
    }

    @PostMapping("/transfer")
    @Operation(summary = "Atomic transfer with fee via Fineract plugin")
    public ResponseEntity<TransferResponse> transfer(
            @RequestHeader(value = "X-KYC-Level", defaultValue = "1") int kycLevel,
            @RequestHeader(value = "X-User-Id", defaultValue = "") String userId,
            @Valid @RequestBody TransferRequest req) {
        log.info("Transfer: from={}, to={}, amount={}", req.fromCustomerId(), req.toCustomerId(), req.amount());

        // Validate limits on sender
        limitService.validateTransaction(req.fromCustomerId(), userId, kycLevel, "p2p", req.amount());

        TransferResponse result = transferService.transfer(req);
        limitService.recordTransaction(req.fromCustomerId(), "p2p", req.amount());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/transactions")
    @Operation(summary = "Paginated transaction history")
    public ResponseEntity<List<Map<String, Object>>> getTransactions(
            @PathVariable String id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Getting transactions for customer: {}, page: {}, size: {}", id, page, size);

        List<Map<String, Object>> txns = accountService.getSavingsAccountTransactions(Long.parseLong(id));
        // Simple pagination
        int start = (page - 1) * size;
        int end = Math.min(start + size, txns.size());
        List<Map<String, Object>> paged = start < txns.size() ? txns.subList(start, end) : List.of();

        return ResponseEntity.ok(paged);
    }

    @PostMapping("/{id}/loan")
    @Operation(summary = "Create loan and disburse to wallet")
    public ResponseEntity<LoanResponse> createLoan(
            @PathVariable String id,
            @Valid @RequestBody LoanRequest req) {
        log.info("Creating loan for customer: {}, product: {}, amount: {}", id, req.productId(), req.amount());

        LoanResponse result = loanService.createAndDisburseLoan(id, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/{id}/loan/{loanId}/repay")
    @Operation(summary = "Record loan repayment")
    public ResponseEntity<TxnResponse> repayLoan(
            @PathVariable String id,
            @PathVariable String loanId,
            @RequestBody Map<String, Object> body) {
        long amount = ((Number) body.getOrDefault("amount", 0)).longValue();
        String key = (String) body.getOrDefault("idempotency_key", "");
        log.info("Repaying loan: loanId={}, amount={}", loanId, amount);

        TxnResponse result = loanService.repayLoan(id, loanId, amount, key);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/loan/active")
    @Operation(summary = "Get active loan")
    public ResponseEntity<Map<String, Object>> getActiveLoan(@PathVariable String id) {
        Map<String, Object> loan = loanService.getActiveLoan(id);
        if (loan == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/{id}/loan/history")
    @Operation(summary = "Get loan history")
    public ResponseEntity<List<Map<String, Object>>> getLoanHistory(@PathVariable String id) {
        return ResponseEntity.ok(loanService.getLoanHistory(id));
    }
}
