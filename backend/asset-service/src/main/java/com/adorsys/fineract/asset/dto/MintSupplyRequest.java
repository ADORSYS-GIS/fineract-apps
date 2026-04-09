package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Admin request to mint (create) additional supply for an existing asset.
 *
 * <p>Submitted as the request body to {@code POST /api/admin/assets/{assetId}/mint}.
 * Minting increases {@code totalSupply} and therefore {@code availableSupply} by
 * {@code additionalSupply} units, without affecting {@code circulatingSupply}.
 * Only assets in ACTIVE or HALTED status can be minted; DELISTED assets are rejected.
 *
 * <p>Use this when demand exceeds available supply or when a new issuance tranche is
 * approved by the asset manager. The operation is recorded in the audit log with the
 * requesting admin's identity.
 */
public record MintSupplyRequest(

    /**
     * Number of additional units to create and add to the asset's {@code totalSupply}.
     * Must be a strictly positive value — minting zero or negative units is rejected with
     * a 400 error. There is no upper bound enforced at the API level; the admin is
     * responsible for staying within the approved issuance programme limits.
     * Units are asset-specific (e.g. bond units, fund shares) and are not in XAF.
     */
    @NotNull @Positive BigDecimal additionalSupply

) {}
