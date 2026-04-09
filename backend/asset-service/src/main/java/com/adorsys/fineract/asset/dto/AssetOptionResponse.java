package com.adorsys.fineract.asset.dto;

/**
 * Lightweight asset summary returned by the asset options endpoint
 * ({@code GET /assets/options}). Designed for populating filter dropdowns,
 * search typeaheads, and other UI controls that only need enough information
 * to identify an asset — no pricing or supply data is included.
 *
 * <p>All active (and optionally other status) assets may appear here depending
 * on the caller's role. The list is typically sorted alphabetically by symbol.</p>
 */
public record AssetOptionResponse(
    /** Internal asset identifier (UUID). Used as the option value in form selects. */
    String assetId,
    /** Ticker symbol (e.g. "BRVM"). Shown as the primary label in dropdowns. */
    String symbol,
    /** Full human-readable asset name. Shown as secondary text or tooltip in dropdowns. */
    String name
) {
}
