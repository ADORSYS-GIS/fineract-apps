package com.adorsys.fineract.registration.dto.webank;

import java.util.List;

public record AgencyReportResponse(
    List<AgencyStats> branches
) {
    public record AgencyStats(
        String branchName,
        int officeId,
        long opsCount,
        long agentsServed,
        long totalProvisioned
    ) {}
}
