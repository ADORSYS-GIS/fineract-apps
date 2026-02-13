package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Orchestrates Fineract provisioning when an admin creates a new asset.
 * Steps: register currency -> create savings product -> create treasury account
 * -> approve -> activate -> deposit initial supply.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AssetProvisioningService {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final FineractClient fineractClient;
    private final AssetCatalogService assetCatalogService;
    private final AssetServiceConfig assetServiceConfig;

    /**
     * Create a new asset with full Fineract provisioning.
     */
    @SuppressWarnings("unchecked")
    @Transactional
    @PreAuthorize("hasRole('ASSET_MANAGER')")
    public AssetDetailResponse createAsset(CreateAssetRequest request) {
        // Validate uniqueness
        if (assetRepository.findBySymbol(request.symbol()).isPresent()) {
            throw new AssetException("Symbol already exists: " + request.symbol());
        }
        if (assetRepository.findByCurrencyCode(request.currencyCode()).isPresent()) {
            throw new AssetException("Currency code already exists: " + request.currencyCode());
        }

        // Validate bond-specific fields when category is BONDS
        if (request.category() == AssetCategory.BONDS) {
            validateBondFields(request);
        }

        String assetId = UUID.randomUUID().toString();
        log.info("Creating asset: id={}, symbol={}, currency={}", assetId, request.symbol(), request.currencyCode());

        Integer productId = null;
        Long treasuryAssetAccountId = null;
        Long treasuryCashAccountId = null;

        try {
            // Step 1: Auto-derive treasury cash account (settlement currency)
            String settlementCurrency = assetServiceConfig.getSettlementCurrency();
            List<Map<String, Object>> accounts = fineractClient.getClientSavingsAccounts(request.treasuryClientId());
            List<Long> matchingCashAccounts = accounts.stream()
                    .filter(a -> {
                        Map<String, Object> currency = (Map<String, Object>) a.get("currency");
                        Map<String, Object> status = (Map<String, Object>) a.get("status");
                        return currency != null && settlementCurrency.equals(currency.get("code"))
                                && status != null && Boolean.TRUE.equals(status.get("active"));
                    })
                    .map(a -> ((Number) a.get("id")).longValue())
                    .toList();
            if (matchingCashAccounts.size() > 1) {
                log.warn("Multiple active {} savings accounts found for treasury client {}: {}. Using first: {}",
                        settlementCurrency, request.treasuryClientId(), matchingCashAccounts, matchingCashAccounts.get(0));
            }
            treasuryCashAccountId = matchingCashAccounts.stream().findFirst()
                    .orElseThrow(() -> new AssetException(
                            "No active " + settlementCurrency + " savings account found for company (client ID: " + request.treasuryClientId()
                            + "). Please create and approve a " + settlementCurrency + " savings account for this company in the Account Manager before creating an asset."));
            log.info("Auto-derived treasury cash account: {}", treasuryCashAccountId);

            // Step 2: Register custom currency in Fineract
            fineractClient.registerCurrencies(List.of(request.currencyCode()));
            log.info("Registered currency: {}", request.currencyCode());

            // Step 3: Create savings product
            productId = fineractClient.createSavingsProduct(
                    request.name() + " Token",
                    request.symbol(),
                    request.currencyCode(),
                    request.decimalPlaces(),
                    assetServiceConfig.getGlAccounts().getDigitalAssetInventory(),
                    assetServiceConfig.getGlAccounts().getCustomerDigitalAssetHoldings()
            );
            log.info("Created savings product: productId={}", productId);

            // Step 4: Atomic account lifecycle — create, approve, activate, deposit initial supply
            // Uses Fineract Batch API (enclosingTransaction=true) so if any step fails, all are rolled back
            treasuryAssetAccountId = fineractClient.provisionSavingsAccount(
                    request.treasuryClientId(), productId,
                    request.totalSupply(), assetServiceConfig.getGlAccounts().getAssetIssuancePaymentType()
            );
            log.info("Provisioned treasury account atomically: accountId={}, supply={}",
                    treasuryAssetAccountId, request.totalSupply());

        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            // NOTE: If currency was registered but account creation failed, the currency remains in Fineract.
            // A retry with the same currency code will fail because the currency already exists.
            // Manual cleanup via Fineract admin API may be needed.
            log.error("Fineract provisioning failed for asset {}: {}. productId={}, currencyCode={}. "
                    + "Manual cleanup of orphaned Fineract resources may be required.",
                    assetId, e.getMessage(), productId, request.currencyCode());
            throw new AssetException("Failed to provision asset in Fineract: " + e.getMessage(), e);
        }

        // Step 8: Persist asset entity
        Asset asset = Asset.builder()
                .id(assetId)
                .fineractProductId(productId)
                .symbol(request.symbol())
                .currencyCode(request.currencyCode())
                .name(request.name())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .category(request.category())
                .status(AssetStatus.PENDING)
                .priceMode(PriceMode.MANUAL)
                .manualPrice(request.initialPrice())
                .decimalPlaces(request.decimalPlaces())
                .totalSupply(request.totalSupply())
                .circulatingSupply(BigDecimal.ZERO)
                .tradingFeePercent(request.tradingFeePercent() != null ? request.tradingFeePercent() : new BigDecimal("0.0050"))
                .spreadPercent(request.spreadPercent() != null ? request.spreadPercent() : new BigDecimal("0.0100"))
                .expectedLaunchDate(request.expectedLaunchDate())
                .issuer(request.issuer())
                .isinCode(request.isinCode())
                .maturityDate(request.maturityDate())
                .interestRate(request.interestRate())
                .couponFrequencyMonths(request.couponFrequencyMonths())
                .nextCouponDate(request.nextCouponDate())
                .validityDate(request.validityDate())
                .treasuryClientId(request.treasuryClientId())
                .treasuryAssetAccountId(treasuryAssetAccountId)
                .treasuryCashAccountId(treasuryCashAccountId)
                .build();

        assetRepository.save(asset);

        // Step 8: Initialize price row
        AssetPrice price = AssetPrice.builder()
                .assetId(assetId)
                .currentPrice(request.initialPrice())
                .dayOpen(request.initialPrice())
                .dayHigh(request.initialPrice())
                .dayLow(request.initialPrice())
                .dayClose(request.initialPrice())
                .change24hPercent(BigDecimal.ZERO)
                .updatedAt(Instant.now())
                .build();

        assetPriceRepository.save(price);

        log.info("Asset created successfully: id={}, symbol={}", assetId, request.symbol());

        return assetCatalogService.getAssetDetailAdmin(assetId);
    }

    /**
     * Update asset metadata.
     */
    @Transactional
    @PreAuthorize("hasRole('ASSET_MANAGER')")
    public AssetDetailResponse updateAsset(String assetId, UpdateAssetRequest request) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        if (request.name() != null) asset.setName(request.name());
        if (request.description() != null) asset.setDescription(request.description());
        if (request.imageUrl() != null) asset.setImageUrl(request.imageUrl());
        if (request.category() != null) asset.setCategory(request.category());
        if (request.tradingFeePercent() != null) asset.setTradingFeePercent(request.tradingFeePercent());
        if (request.spreadPercent() != null) asset.setSpreadPercent(request.spreadPercent());
        if (request.interestRate() != null) asset.setInterestRate(request.interestRate());
        if (request.maturityDate() != null) asset.setMaturityDate(request.maturityDate());
        if (request.validityDate() != null) asset.setValidityDate(request.validityDate());

        assetRepository.save(asset);
        log.info("Updated asset: id={}", assetId);

        return assetCatalogService.getAssetDetailAdmin(assetId);
    }

    /**
     * Activate an asset (PENDING -> ACTIVE).
     */
    @Transactional
    @PreAuthorize("hasRole('ASSET_MANAGER')")
    public void activateAsset(String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        if (asset.getStatus() != AssetStatus.PENDING) {
            throw new AssetException("Asset must be PENDING to activate. Current: " + asset.getStatus());
        }

        asset.setStatus(AssetStatus.ACTIVE);
        assetRepository.save(asset);
        log.info("Activated asset: id={}", assetId);
    }

    /**
     * Halt trading for an asset.
     */
    @Transactional
    @PreAuthorize("hasRole('ASSET_MANAGER')")
    public void haltAsset(String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        if (asset.getStatus() != AssetStatus.ACTIVE) {
            throw new AssetException("Asset must be ACTIVE to halt. Current: " + asset.getStatus());
        }

        asset.setStatus(AssetStatus.HALTED);
        assetRepository.save(asset);
        log.info("Halted trading for asset: id={}", assetId);
    }

    /**
     * Mint additional supply for an asset (deposit more tokens into treasury).
     */
    @Transactional
    @PreAuthorize("hasRole('ASSET_MANAGER')")
    public void mintSupply(String assetId, MintSupplyRequest request) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        // Deposit additional units into treasury via Fineract
        fineractClient.depositToSavingsAccount(
                asset.getTreasuryAssetAccountId(),
                request.additionalSupply(),
                assetServiceConfig.getGlAccounts().getAssetIssuancePaymentType());

        // Update total supply
        asset.setTotalSupply(asset.getTotalSupply().add(request.additionalSupply()));
        assetRepository.save(asset);

        log.info("Minted {} additional units for asset {}, new total supply: {}",
                request.additionalSupply(), assetId, asset.getTotalSupply());
    }

    /**
     * Resume trading for a halted asset.
     */
    @Transactional
    @PreAuthorize("hasRole('ASSET_MANAGER')")
    public void resumeAsset(String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        if (asset.getStatus() != AssetStatus.HALTED) {
            throw new AssetException("Asset must be HALTED to resume. Current: " + asset.getStatus());
        }

        asset.setStatus(AssetStatus.ACTIVE);
        assetRepository.save(asset);
        log.info("Resumed trading for asset: id={}", assetId);
    }

    /**
     * Validates that all required bond fields are present and consistent.
     *
     * @param request the create asset request with category BONDS
     * @throws AssetException if any bond-specific validation fails
     */
    private void validateBondFields(CreateAssetRequest request) {
        if (request.issuer() == null || request.issuer().isBlank()) {
            throw new AssetException("Issuer is required for BONDS category");
        }
        if (request.maturityDate() == null) {
            throw new AssetException("Maturity date is required for BONDS category");
        }
        if (!request.maturityDate().isAfter(LocalDate.now())) {
            throw new AssetException("Maturity date must be in the future");
        }
        if (request.interestRate() == null) {
            throw new AssetException("Interest rate is required for BONDS category");
        }
        if (request.couponFrequencyMonths() == null) {
            throw new AssetException("Coupon frequency is required for BONDS category");
        }
        if (!Set.of(1, 3, 6, 12).contains(request.couponFrequencyMonths())) {
            throw new AssetException("Coupon frequency must be 1 (monthly), 3 (quarterly), 6 (semi-annual), or 12 (annual)");
        }
        if (request.nextCouponDate() == null) {
            throw new AssetException("First coupon date is required for BONDS category");
        }
        if (request.nextCouponDate().isAfter(request.maturityDate())) {
            throw new AssetException("First coupon date must be on or before the maturity date");
        }
    }
}
