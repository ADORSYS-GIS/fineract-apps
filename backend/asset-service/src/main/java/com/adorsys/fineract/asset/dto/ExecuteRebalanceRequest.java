package com.adorsys.fineract.asset.dto;

import java.util.List;

/**
 * Request body for executing a treasury rebalance plan, sent to
 * {@code POST /api/admin/treasury/rebalance/execute}.
 *
 * <p>An admin first calls {@code GET /api/admin/treasury/rebalance/propose} to receive a
 * {@link RebalanceProposalResponse} containing a list of proposed fund transfers. After
 * reviewing the proposal, the admin submits the approved transfers in this request to
 * trigger actual settlement execution.</p>
 *
 * <p>The {@code transfers} list is expected to match the {@code transfers} field from the
 * proposal response exactly, though the admin may omit specific transfers they do not wish
 * to execute (e.g. to skip a TAX_REMITTANCE phase). Each transfer is executed sequentially
 * in the order of its {@code phase} field. Partial execution is recorded in the settlement
 * audit log.</p>
 *
 * <p>If any individual transfer fails (e.g. insufficient GL balance, Fineract API error),
 * the remaining transfers are aborted and a partial-failure response is returned.</p>
 */
public record ExecuteRebalanceRequest(
    /**
     * Ordered list of fund transfers to execute.
     * Each entry was originally proposed by the rebalance proposal endpoint and
     * carries settlement type, source/destination GL codes, amount, and phase ordering.
     * Must not be null; may be empty (results in a no-op execution).
     */
    List<RebalanceProposalResponse.ProposedTransfer> transfers
) {}
