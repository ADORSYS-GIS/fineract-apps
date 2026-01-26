package com.adorsys.fineract.registration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycStatsResponse {
    private int pendingCount;
    private int approvedToday;
    private int rejectedToday;
    private Integer avgReviewTimeMinutes;
}
