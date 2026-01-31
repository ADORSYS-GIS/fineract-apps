package com.adorsys.fineract.registration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycSubmissionsResponse {
    private List<KycSubmissionSummary> items;
    private int total;
    private int page;
    private int pageSize;
}
