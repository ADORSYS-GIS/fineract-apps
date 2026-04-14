package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Generates a collision-safe Fineract currency code from an asset symbol.
 *
 * <p>Currency codes are an <em>internal</em> Fineract implementation detail — they identify
 * the savings product currency in core banking but are never shown to end users. By
 * auto-generating them, we eliminate the entire class of "currency code already exists" errors
 * that admins faced when manually entering codes that collided with previous or existing assets.
 *
 * <h3>Generation strategy (in order of preference):</h3>
 * <ol>
 *   <li>Use the first 4 alphanumeric chars of the symbol (e.g. {@code BRVM} → {@code BRVM}).</li>
 *   <li>If that collides, try the first 3 chars + suffix {@code A}–{@code Z}
 *       (e.g. {@code BRV} → {@code BRVA}, {@code BRVB}, …).</li>
 *   <li>If still colliding, try 2 chars + two-char suffix {@code AA}–{@code ZZ}.</li>
 * </ol>
 *
 * <p>Collision is checked against both the local DB ({@code Asset.currencyCode}) and the
 * set of codes already registered in Fineract (passed in by the caller to avoid repeated
 * remote calls during a single provisioning operation).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CurrencyCodeGenerator {

    private final AssetRepository assetRepository;

    /**
     * Derives a unique 3–4 character currency code for the given asset symbol.
     *
     * @param symbol               the asset ticker symbol (e.g. {@code "BRVM-SABC"})
     * @param registeredInFineract set of currency codes already registered in Fineract
     *                             (fetched once by caller to avoid repeated API calls)
     * @return a unique currency code guaranteed not to collide with local DB or Fineract
     * @throws AssetException if the symbol's namespace is fully exhausted (extremely unlikely)
     */
    public String generate(String symbol, Set<String> registeredInFineract) {
        // Normalise: uppercase, strip non-alphanumeric
        String clean = symbol.toUpperCase().replaceAll("[^A-Z0-9]", "");
        if (clean.isEmpty()) {
            clean = "AST"; // fallback for symbols that contain only special chars
        }

        // Round 1: up to 4-char base
        String base4 = clean.substring(0, Math.min(4, clean.length()));
        if (isAvailable(base4, registeredInFineract)) {
            log.debug("Generated currency code '{}' for symbol '{}'", base4, symbol);
            return base4;
        }

        // Round 2: 3-char prefix + single letter suffix (A–Z → 26 candidates)
        String base3 = clean.substring(0, Math.min(3, clean.length()));
        for (char c = 'A'; c <= 'Z'; c++) {
            String candidate = base3 + c;
            if (isAvailable(candidate, registeredInFineract)) {
                log.debug("Generated currency code '{}' (with suffix) for symbol '{}'", candidate, symbol);
                return candidate;
            }
        }

        // Round 3: 2-char prefix + two-letter suffix (AA–ZZ → 676 candidates)
        String base2 = clean.substring(0, Math.min(2, clean.length()));
        for (char c1 = 'A'; c1 <= 'Z'; c1++) {
            for (char c2 = 'A'; c2 <= 'Z'; c2++) {
                String candidate = base2 + c1 + c2;
                if (isAvailable(candidate, registeredInFineract)) {
                    log.debug("Generated currency code '{}' (2-char base) for symbol '{}'", candidate, symbol);
                    return candidate;
                }
            }
        }

        // Should never happen in practice (702 candidates before exhaustion)
        throw new AssetException(
            "Cannot generate a unique currency code for symbol '" + symbol
            + "'. All 702 candidates derived from this symbol are already in use. "
            + "Please contact support.");
    }

    private boolean isAvailable(String code, Set<String> registeredInFineract) {
        return !assetRepository.existsByCurrencyCode(code)
            && !registeredInFineract.contains(code);
    }
}
