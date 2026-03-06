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

    private List<Map<String, Object>> transactions;
    private Integer total;
    private Integer page;
    private Integer pageSize;
}
