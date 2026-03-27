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
import com.adorsys.fineract.asset.repository.PriceHistoryRepository;
import com.adorsys.fineract.asset.repository.PurchaseLotRepository;
import com.adorsys.fineract.asset.repository.ScheduledPaymentRepository;
import com.adorsys.fineract.asset.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Orchestrates Fineract provisioning when an admin creates a new asset.
 * Steps: register currency -> create savings product -> create LP account
 * -> approve -> activate -> deposit initial supply.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AssetProvisioningService {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final PurchaseLotRepository purchaseLotRepository;
    private final ScheduledPaymentRepository scheduledPaymentRepository;
    private final FineractClient fineractClient;
    private final AssetCatalogService assetCatalogService;
    private final PricingService pricingService;
    private final AssetServiceConfig assetServiceConfig;
    private final ResolvedGlAccounts resolvedGlAccounts;
    private final FileStorageService fileStorageService;

    /**
     * Create a new asset with full Fineract provisioning.
     */
    @SuppressWarnings("unchecked")
    @Transactional
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public AssetDetailResponse createAsset(CreateAssetRequest request) {
        // Auto-derive currencyCode from symbol if not provided
        String effectiveCurrencyCode = (request.currencyCode() != null && !request.currencyCode().isBlank())
                ? request.currencyCode() : request.symbol();

        // Validate uniqueness in local DB
        if (assetRepository.findBySymbol(request.symbol()).isPresent()) {
            throw new AssetException("Symbol already exists: " + request.symbol());
        }
        if (assetRepository.findByCurrencyCode(effectiveCurrencyCode).isPresent()) {
            throw new AssetException("Currency code already exists: " + effectiveCurrencyCode);
        }

        // Check Fineract for orphaned resources (from previously failed creations)
        Integer existingProduct = fineractClient.findSavingsProductByShortName(request.symbol());
        if (existingProduct != null) {
            throw new AssetException("A savings product with symbol '" + request.symbol()
                    + "' already exists in the core banking system (product ID: " + existingProduct
                    + "). This may be from a previously failed creation. Please use a different symbol "
                    + "or clean up the orphaned product.");
        }
        List<Map<String, Object>> currencies = fineractClient.getExistingCurrencies();
        boolean currencyExists = currencies.stream()
                .anyMatch(c -> effectiveCurrencyCode.equals(c.get("code")));
        if (currencyExists) {
            throw new AssetException("A currency with code '" + effectiveCurrencyCode
                    + "' is already registered in the core banking system. "
                    + "This may be from a previously failed creation.");
        }

        // Validate bid/ask spread before provisioning Fineract resources
        if (request.lpBidPrice().compareTo(request.lpAskPrice()) > 0) {
            throw new AssetException("Invalid spread: bid price (" + request.lpBidPrice()
                    + ") must not exceed ask price (" + request.lpAskPrice() + ")");
        }

        // Validate bond-specific fields when category is BONDS
        if (request.category() == AssetCategory.BONDS) {
            validateBondFields(request);
        }

        String assetId = UUID.randomUUID().toString();
        log.info("Creating asset: id={}, symbol={}, currency={}", assetId, request.symbol(), effectiveCurrencyCode);

        // Look up LP client display name (best-effort, non-blocking)
        String lpClientName = fineractClient.getClientDisplayName(request.lpClientId());

        Integer productId = null;
        Long lpAssetAccountId = null;
        Long lpCashAccountId = null;
        Long lpSpreadAccountId = null;

        try {
            // Step 1: Create a dedicated settlement currency (XAF) savings account for the LP
            String productShortName = assetServiceConfig.getSettlementCurrencyProductShortName();
            Integer xafProductId = fineractClient.findSavingsProductByShortName(productShortName);
            if (xafProductId == null) {
                throw new AssetException("Settlement currency savings product '" + productShortName
                        + "' not found in Fineract. Please create it before provisioning assets.");
            }
            lpCashAccountId = fineractClient.provisionSavingsAccount(
                    request.lpClientId(), xafProductId, null, null);
            log.info("Created dedicated {} LP cash account: {}", assetServiceConfig.getSettlementCurrency(), lpCashAccountId);

            // Step 1b: Create LP spread collection account (XAF savings account under LP client)
            lpSpreadAccountId = fineractClient.provisionSavingsAccount(
                    request.lpClientId(), xafProductId, null, null);
            log.info("Created LP spread collection account: {}", lpSpreadAccountId);

            // Step 2: Register custom currency in Fineract
            fineractClient.registerCurrencies(List.of(effectiveCurrencyCode));
            log.info("Registered currency: {}", effectiveCurrencyCode);

            // Step 3: Create savings product (using resolved DB IDs, not GL codes)
            productId = fineractClient.createSavingsProduct(
                    request.name() + " Token",
                    request.symbol(),
                    effectiveCurrencyCode,
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
            lpAssetAccountId = fineractClient.provisionSavingsAccount(
                    request.lpClientId(), productId,
                    request.totalSupply(), resolvedGlAccounts.getAssetIssuancePaymentTypeId()
            );
            log.info("Provisioned LP asset account atomically: accountId={}, supply={}",
                    lpAssetAccountId, request.totalSupply());

        } catch (AssetException e) {
            rollbackFineractResources(productId, effectiveCurrencyCode, lpCashAccountId, lpSpreadAccountId, lpAssetAccountId, assetId);
            throw e;
        } catch (Exception e) {
            rollbackFineractResources(productId, effectiveCurrencyCode, lpCashAccountId, lpSpreadAccountId, lpAssetAccountId, assetId);
            log.error("Fineract provisioning failed for asset {}: {}. productId={}.",
                    assetId, e.getMessage(), productId);
            throw new AssetException("Failed to provision asset in Fineract: " + e.getMessage(), e);
        }

        // Step 5: Persist asset entity
        Asset asset = Asset.builder()
                .id(assetId)
                .fineractProductId(productId)
                .symbol(request.symbol())
                .currencyCode(effectiveCurrencyCode)
                .name(request.name())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .category(request.category())
                .status(AssetStatus.PENDING)
                .priceMode(PriceMode.MANUAL)
                .manualPrice(request.issuerPrice())
                .issuerPrice(request.issuerPrice())
                .decimalPlaces(request.decimalPlaces())
                .totalSupply(request.totalSupply())
                .circulatingSupply(BigDecimal.ZERO)
                .tradingFeePercent(request.tradingFeePercent() != null ? request.tradingFeePercent() : new BigDecimal("0.0050"))
                .issuerName(request.issuerName())
                .isinCode(request.isinCode())
                .maturityDate(request.maturityDate())
                .interestRate(request.interestRate())
                .couponFrequencyMonths(request.couponFrequencyMonths())
                .nextCouponDate(request.nextCouponDate())
                .lpClientId(request.lpClientId())
                .lpClientName(lpClientName)
                .lpAssetAccountId(lpAssetAccountId)
                .lpCashAccountId(lpCashAccountId)
                .lpSpreadAccountId(lpSpreadAccountId)
                .maxPositionPercent(request.maxPositionPercent())
                .maxOrderSize(request.maxOrderSize())
                .dailyTradeLimitXaf(request.dailyTradeLimitXaf())
                .lockupDays(request.lockupDays())
                .minOrderSize(request.minOrderSize())
                .minOrderCashAmount(request.minOrderCashAmount())
                .incomeType(request.incomeType())
                .incomeRate(request.incomeRate())
                .distributionFrequencyMonths(request.distributionFrequencyMonths())
                .nextDistributionDate(request.nextDistributionDate())
                // Tax configuration (defaults applied by @Builder.Default on entity)
                .registrationDutyEnabled(request.registrationDutyEnabled() != null ? request.registrationDutyEnabled() : true)
                .registrationDutyRate(request.registrationDutyRate())
                .ircmEnabled(request.ircmEnabled() != null ? request.ircmEnabled() : true)
                .ircmRateOverride(request.ircmRateOverride())
                .ircmExempt(request.ircmExempt() != null ? request.ircmExempt() : false)
                .capitalGainsTaxEnabled(request.capitalGainsTaxEnabled() != null ? request.capitalGainsTaxEnabled() : true)
                .capitalGainsRate(request.capitalGainsRate())
                .isBvmacListed(request.isBvmacListed() != null ? request.isBvmacListed() : false)
                .isGovernmentBond(request.isGovernmentBond() != null ? request.isGovernmentBond() : false)
                .build();

        assetRepository.save(asset);

        // Step 6: Initialize price row with LP bid/ask prices
        AssetPrice price = AssetPrice.builder()
                .assetId(assetId)
                .dayOpen(request.lpAskPrice())
                .dayHigh(request.lpAskPrice())
                .dayLow(request.lpAskPrice())
                .dayClose(request.lpAskPrice())
                .bidPrice(request.lpBidPrice())
                .askPrice(request.lpAskPrice())
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

        // PENDING-only fields: reject early before any mutations
        boolean hasPendingOnlyField = request.issuerPrice() != null || request.totalSupply() != null
                || request.issuerName() != null || request.isinCode() != null
                || request.couponFrequencyMonths() != null;

        if (hasPendingOnlyField && asset.getStatus() != AssetStatus.PENDING) {
            throw new AssetException("Fields issuerPrice, totalSupply, issuerName, isinCode, couponFrequencyMonths "
                    + "can only be changed when asset is PENDING. Current status: " + asset.getStatus());
        }

        if (request.name() != null) asset.setName(request.name());
        if (request.description() != null) asset.setDescription(request.description());
        if (request.imageUrl() != null) {
            deleteStoredFileIfKey(asset.getImageUrl());
            asset.setImageUrl(request.imageUrl());
        }
        if (request.category() != null) asset.setCategory(request.category());
        if (request.tradingFeePercent() != null) asset.setTradingFeePercent(request.tradingFeePercent());
        if (request.interestRate() != null) asset.setInterestRate(request.interestRate());
        if (request.maturityDate() != null) asset.setMaturityDate(request.maturityDate());
        if (request.nextCouponDate() != null) asset.setNextCouponDate(request.nextCouponDate());

        // Exposure limits
        if (request.maxPositionPercent() != null) asset.setMaxPositionPercent(request.maxPositionPercent());
        if (request.maxOrderSize() != null) asset.setMaxOrderSize(request.maxOrderSize());
        if (request.dailyTradeLimitXaf() != null) asset.setDailyTradeLimitXaf(request.dailyTradeLimitXaf());
        if (request.lockupDays() != null) asset.setLockupDays(request.lockupDays());
        if (request.minOrderSize() != null) asset.setMinOrderSize(request.minOrderSize());
        if (request.minOrderCashAmount() != null) asset.setMinOrderCashAmount(request.minOrderCashAmount());

        // Income distribution
        if (request.incomeType() != null) asset.setIncomeType(request.incomeType());
        if (request.incomeRate() != null) asset.setIncomeRate(request.incomeRate());
        if (request.distributionFrequencyMonths() != null) asset.setDistributionFrequencyMonths(request.distributionFrequencyMonths());
        if (request.nextDistributionDate() != null) asset.setNextDistributionDate(request.nextDistributionDate());

        // Tax configuration
        if (request.registrationDutyEnabled() != null) asset.setRegistrationDutyEnabled(request.registrationDutyEnabled());
        if (request.registrationDutyRate() != null) asset.setRegistrationDutyRate(request.registrationDutyRate());
        if (request.ircmEnabled() != null) asset.setIrcmEnabled(request.ircmEnabled());
        if (request.ircmRateOverride() != null) asset.setIrcmRateOverride(request.ircmRateOverride());
        if (request.ircmExempt() != null) asset.setIrcmExempt(request.ircmExempt());
        if (request.capitalGainsTaxEnabled() != null) asset.setCapitalGainsTaxEnabled(request.capitalGainsTaxEnabled());
        if (request.capitalGainsRate() != null) asset.setCapitalGainsRate(request.capitalGainsRate());
        if (request.isBvmacListed() != null) asset.setIsBvmacListed(request.isBvmacListed());
        if (request.isGovernmentBond() != null) asset.setIsGovernmentBond(request.isGovernmentBond());

        // Apply PENDING-only field mutations
        if (hasPendingOnlyField) {
            if (request.issuerPrice() != null) {
                asset.setIssuerPrice(request.issuerPrice());
                asset.setManualPrice(request.issuerPrice());
            }
            if (request.totalSupply() != null) {
                BigDecimal oldSupply = asset.getTotalSupply();
                BigDecimal newSupply = request.totalSupply();
                asset.setTotalSupply(newSupply);

                // Adjust LP asset account balance to match new total supply
                if (asset.getLpAssetAccountId() != null && oldSupply != null) {
                    BigDecimal delta = newSupply.subtract(oldSupply);
                    if (delta.compareTo(BigDecimal.ZERO) > 0) {
                        fineractClient.depositToSavingsAccount(
                                asset.getLpAssetAccountId(), delta,
                                resolvedGlAccounts.getAssetIssuancePaymentTypeId());
                    } else if (delta.compareTo(BigDecimal.ZERO) < 0) {
                        fineractClient.withdrawFromSavingsAccount(
                                asset.getLpAssetAccountId(), delta.abs(),
                                "Supply adjustment: burn " + delta.abs() + " units for " + asset.getSymbol());
                    }
                }
            }
            if (request.issuerName() != null) asset.setIssuerName(request.issuerName());
            if (request.isinCode() != null) asset.setIsinCode(request.isinCode());
            if (request.couponFrequencyMonths() != null) asset.setCouponFrequencyMonths(request.couponFrequencyMonths());
        }

        assetRepository.save(asset);

        // Update LP bid/ask prices if provided
        if (request.lpBidPrice() != null || request.lpAskPrice() != null) {
            AssetPrice price = assetPriceRepository.findById(assetId).orElse(null);
            if (price != null) {
                if (request.lpBidPrice() != null) price.setBidPrice(request.lpBidPrice());
                if (request.lpAskPrice() != null) price.setAskPrice(request.lpAskPrice());
                BigDecimal effectiveBid = price.getBidPrice();
                BigDecimal effectiveAsk = price.getAskPrice();
                if (effectiveBid != null && effectiveAsk != null
                        && effectiveBid.compareTo(effectiveAsk) > 0) {
                    throw new AssetException("Invalid spread: bid price (" + effectiveBid
                            + ") must not exceed ask price (" + effectiveAsk + ")");
                }
                assetPriceRepository.save(price);
            }
        }

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
     * Mint additional supply for an asset (deposit more tokens into LP inventory).
     */
    @Transactional
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public void mintSupply(String assetId, MintSupplyRequest request) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        // Deposit additional units into LP inventory via Fineract
        fineractClient.depositToSavingsAccount(
                asset.getLpAssetAccountId(),
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
     * Delete a PENDING asset with full Fineract cleanup.
     * Only PENDING assets can be deleted — no trades, positions, or payments exist.
     */
    @Transactional
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public void deletePendingAsset(String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        if (asset.getStatus() != AssetStatus.PENDING) {
            throw new AssetException("Only PENDING assets can be deleted. Current: " + asset.getStatus());
        }

        log.info("Deleting pending asset: id={}, symbol={}", assetId, asset.getSymbol());

        // Best-effort Fineract cleanup (log warnings, don't block local deletion)
        cleanupFineractResources(asset);

        // Clean up stored image file
        deleteStoredFileIfKey(asset.getImageUrl());

        // Delete local data
        purchaseLotRepository.deleteByAssetId(assetId);
        scheduledPaymentRepository.deleteByAssetId(assetId);
        priceHistoryRepository.deleteByAssetId(assetId);
        assetPriceRepository.deleteByAssetId(assetId);
        assetRepository.delete(asset);

        log.info("Deleted pending asset: id={}, symbol={}", assetId, asset.getSymbol());
    }

    /**
     * Best-effort cleanup of Fineract resources for a pending asset.
     * Steps: withdraw balance → close accounts → delete product → deregister currency.
     */
    private void cleanupFineractResources(Asset asset) {
        // 1. Withdraw balance from LP asset account (holds initial supply)
        if (asset.getLpAssetAccountId() != null) {
            try {
                BigDecimal balance = fineractClient.getAccountBalance(asset.getLpAssetAccountId());
                if (balance != null && balance.compareTo(BigDecimal.ZERO) > 0) {
                    fineractClient.withdrawFromSavingsAccount(
                            asset.getLpAssetAccountId(), balance,
                            "Asset deletion: withdraw supply for " + asset.getSymbol());
                }
            } catch (Exception e) {
                log.warn("Failed to withdraw from LP asset account {} for asset {}: {}",
                        asset.getLpAssetAccountId(), asset.getSymbol(), e.getMessage());
            }
        }

        // 2. Close LP asset account
        if (asset.getLpAssetAccountId() != null) {
            try {
                fineractClient.closeSavingsAccount(
                        asset.getLpAssetAccountId(),
                        "Asset deletion: " + asset.getSymbol());
            } catch (Exception e) {
                log.warn("Failed to close LP asset account {} for asset {}: {}",
                        asset.getLpAssetAccountId(), asset.getSymbol(), e.getMessage());
            }
        }

        // 3. Close LP cash account
        if (asset.getLpCashAccountId() != null) {
            try {
                fineractClient.closeSavingsAccount(
                        asset.getLpCashAccountId(),
                        "Asset deletion: " + asset.getSymbol());
            } catch (Exception e) {
                log.warn("Failed to close LP cash account {} for asset {}: {}",
                        asset.getLpCashAccountId(), asset.getSymbol(), e.getMessage());
            }
        }

        // 4. Delete savings product
        if (asset.getFineractProductId() != null) {
            try {
                fineractClient.deleteSavingsProduct(asset.getFineractProductId());
            } catch (Exception e) {
                log.warn("Failed to delete savings product {} for asset {}: {}",
                        asset.getFineractProductId(), asset.getSymbol(), e.getMessage());
            }
        }

        // 5. Deregister currency
        if (asset.getCurrencyCode() != null) {
            try {
                fineractClient.deregisterCurrency(asset.getCurrencyCode());
            } catch (Exception e) {
                log.warn("Failed to deregister currency {} for asset {}: {}",
                        asset.getCurrencyCode(), asset.getSymbol(), e.getMessage());
            }
        }
    }

    /**
     * Validates that all required bond fields are present and consistent.
     *
     * @param request the create asset request with category BONDS
     * @throws AssetException if any bond-specific validation fails
     */
    private void validateBondFields(CreateAssetRequest request) {
        if (request.issuerName() == null || request.issuerName().isBlank()) {
            throw new AssetException("Issuer name is required for BONDS category");
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
    private void rollbackFineractResources(Integer productId, String currencyCode,
                                           Long lpCashAccountId, Long lpSpreadAccountId,
                                           Long lpAssetAccountId, String assetId) {
        log.info("Rolling back Fineract resources for asset {}...", assetId);

        // Close LP accounts (best-effort, same pattern as cleanupFineractResources)
        for (Long accountId : new Long[]{lpAssetAccountId, lpCashAccountId, lpSpreadAccountId}) {
            if (accountId != null) {
                try {
                    BigDecimal balance = fineractClient.getAccountBalance(accountId);
                    if (balance != null && balance.compareTo(BigDecimal.ZERO) > 0) {
                        fineractClient.withdrawFromSavingsAccount(accountId, balance,
                                "Rollback: withdraw for asset " + assetId);
                    }
                } catch (Exception e) {
                    log.warn("Rollback: failed to withdraw from account {} for asset {}: {}",
                            accountId, assetId, e.getMessage());
                }
                try {
                    fineractClient.closeSavingsAccount(accountId,
                            "Rollback: close account for asset " + assetId);
                } catch (Exception e) {
                    log.warn("Rollback: failed to close account {} for asset {}: {}",
                            accountId, assetId, e.getMessage());
                }
            }
        }

        if (productId != null) {
            fineractClient.deleteSavingsProduct(productId);
        }
        if (currencyCode != null) {
            fineractClient.deregisterCurrency(currencyCode);
        }
    }

    /**
     * Deletes a file from storage if the value is a storage key (not a legacy URL).
     */
    private void deleteStoredFileIfKey(String imageUrl) {
        if (imageUrl != null && !imageUrl.isBlank()
                && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            fileStorageService.delete(imageUrl);
        }
    }
}
