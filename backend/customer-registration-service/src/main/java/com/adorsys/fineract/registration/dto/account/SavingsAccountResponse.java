package com.adorsys.fineract.registration.dto.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Response DTO for savings accounts list.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavingsAccountResponse {

    /**
     * List of savings accounts owned by the customer.
     */
    private List<Map<String, Object>> accounts;

    /**
     * Optional summary information.
     */
    private Summary summary;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Summary {
        private Double totalBalance;
        private Integer totalAccounts;
    }
}
