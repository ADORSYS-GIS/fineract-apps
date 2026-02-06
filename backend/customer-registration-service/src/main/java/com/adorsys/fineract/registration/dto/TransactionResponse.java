package com.adorsys.fineract.registration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Response DTO for transactions list.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    /**
     * List of transactions for the account.
     */
    private List<Map<String, Object>> transactions;

    /**
     * Total number of records (for pagination).
     */
    private Integer totalFilteredRecords;
}
