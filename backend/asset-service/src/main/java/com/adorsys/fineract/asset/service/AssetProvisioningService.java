package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
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
    private final ResolvedGlAccounts resolvedGlAccounts;

    /**
     * Create a new asset with full Fineract provisioning.
     */
    @SuppressWarnings("unchecked")
    @Transactional
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public AssetDetailResponse createAsset(CreateAssetRequest request) {
        // Validate uniqueness
        if (assetRepository.findBySymbol(request.symbol()).isPresent()) {
            throw new AssetException("Symbol already exists: " + request.symbol());
        }
        if (assetRepository.findByCurrencyCode(request.currencyCode()).isPresent()) {
            throw new AssetException("Currency code already exists: " + request.currencyCode());
        }

        // Validate subscription dates
        if (request.subscriptionEndDate().isBefore(request.subscriptionStartDate())) {
            throw new AssetException("Subscription end date must be on or after the start date");
        }

        // Validate bond-specific fields when category is BONDS
        if (request.category() == AssetCategory.BONDS) {
            validateBondFields(request);
        }

        String assetId = UUID.randomUUID().toString();
        log.info("Creating asset: id={}, symbol={}, currency={}", assetId, request.symbol(), request.currencyCode());

        // Look up client display name (best-effort, non-blocking)
        String clientName = fineractClient.getClientDisplayName(request.treasuryClientId());

        Integer productId = null;
        Long treasuryAssetAccountId = null;
        Long treasuryCashAccountId = null;

        try {
            // Step 1: Create a dedicated settlement currency (XAF) savings account for this asset
            String productShortName = assetServiceConfig.getSettlementCurrencyProductShortName();
            Integer xafProductId = fineractClient.findSavingsProductByShortName(productShortName);
            if (xafProductId == null) {
                throw new AssetException("Settlement currency savings product '" + productShortName
                        + "' not found in Fineract. Please create it before provisioning assets.");
            }
            treasuryCashAccountId = fineractClient.provisionSavingsAccount(
                    request.treasuryClientId(), xafProductId, null, null);
            log.info("Created dedicated {} treasury cash account: {}", assetServiceConfig.getSettlementCurrency(), treasuryCashAccountId);

            // Step 2: Register custom currency in Fineract
            fineractClient.registerCurrencies(List.of(request.currencyCode()));
            log.info("Registered currency: {}", request.currencyCode());

            // Step 3: Create savings product (using resolved DB IDs, not GL codes)
            productId = fineractClient.createSavingsProduct(
                    request.name() + " Token",
                    request.symbol(),
                    request.currencyCode(),
                    request.decimalPlaces(),
                    resolvedGlAccounts.getDigitalAssetInventoryId(),
                    resolvedGlAccounts.getCustomerDigitalAssetHoldingsId(),
                    resolvedGlAccounts.getTransfersInSuspenseId(),
                    resolvedGlAccounts.getIncomeFromInterestId(),
                    resolvedGlAccounts.getExpenseAccountId()
            );
            log.info("Created savings product: productId={}", productId);

            // Step 4: Atomic account lifecycle — create, approve, activate, deposit initial supply
            // Uses Fineract Batch API (enclosingTransaction=true) so if any step fails, all are rolled back
            treasuryAssetAccountId = fineractClient.provisionSavingsAccount(
                    request.treasuryClientId(), productId,
                    request.totalSupply(), resolvedGlAccounts.getAssetIssuancePaymentTypeId()
            );
            log.info("Provisioned treasury account atomically: accountId={}, supply={}",
                    treasuryAssetAccountId, request.totalSupply());

        } catch (AssetException e) {
            rollbackFineractResources(productId, request.currencyCode(), assetId);
            throw e;
        } catch (Exception e) {
            rollbackFineractResources(productId, request.currencyCode(), assetId);
            log.error("Fineract provisioning failed for asset {}: {}. productId={}.",
                    assetId, e.getMessage(), productId);
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
                .subscriptionStartDate(request.subscriptionStartDate())
                .subscriptionEndDate(request.subscriptionEndDate())
                .capitalOpenedPercent(request.capitalOpenedPercent())
                .issuer(request.issuer())
                .isinCode(request.isinCode())
                .maturityDate(request.maturityDate())
                .interestRate(request.interestRate())
                .couponFrequencyMonths(request.couponFrequencyMonths())
                .nextCouponDate(request.nextCouponDate())
                .treasuryClientId(request.treasuryClientId())
                .treasuryClientName(clientName)
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
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public AssetDetailResponse updateAsset(String assetId, UpdateAssetRequest request) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        // Validate subscription dates if provided
        if (request.subscriptionEndDate() != null && request.subscriptionStartDate() != null) {
            if (request.subscriptionEndDate().isBefore(request.subscriptionStartDate())) {
                throw new AssetException("Subscription end date must be on or after the start date");
            }
        }

        if (request.name() != null) asset.setName(request.name());
        if (request.description() != null) asset.setDescription(request.description());
        if (request.imageUrl() != null) asset.setImageUrl(request.imageUrl());
        if (request.category() != null) asset.setCategory(request.category());
        if (request.tradingFeePercent() != null) asset.setTradingFeePercent(request.tradingFeePercent());
        if (request.spreadPercent() != null) asset.setSpreadPercent(request.spreadPercent());
        if (request.subscriptionStartDate() != null) asset.setSubscriptionStartDate(request.subscriptionStartDate());
        if (request.subscriptionEndDate() != null) asset.setSubscriptionEndDate(request.subscriptionEndDate());
        if (request.capitalOpenedPercent() != null) asset.setCapitalOpenedPercent(request.capitalOpenedPercent());
        if (request.interestRate() != null) asset.setInterestRate(request.interestRate());
        if (request.maturityDate() != null) asset.setMaturityDate(request.maturityDate());

        assetRepository.save(asset);
        log.info("Updated asset: id={}", assetId);

        return assetCatalogService.getAssetDetailAdmin(assetId);
    }

    /**
     * Activate an asset (PENDING -> ACTIVE).
     */
    @Transactional
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
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
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
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
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public void mintSupply(String assetId, MintSupplyRequest request) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        // Deposit additional units into treasury via Fineract
        fineractClient.depositToSavingsAccount(
                asset.getTreasuryAssetAccountId(),
                request.additionalSupply(),
                resolvedGlAccounts.getAssetIssuancePaymentTypeId());

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
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
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

    /**
     * Best-effort rollback of Fineract resources created during provisioning.
     * Follows the same pattern as RegistrationService.rollback().
     */
    private void rollbackFineractResources(Integer productId, String currencyCode, String assetId) {
        log.info("Rolling back Fineract resources for asset {}...", assetId);
        if (productId != null) {
            fineractClient.deleteSavingsProduct(productId);
        }
        if (currencyCode != null) {
            fineractClient.deregisterCurrency(currencyCode);
        }
    }
}
