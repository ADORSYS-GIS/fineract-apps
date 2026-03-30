package com.adorsys.fineract.asset.dto;

import java.util.List;

public record ExecuteRebalanceRequest(
    List<RebalanceProposalResponse.ProposedTransfer> transfers
) {}
