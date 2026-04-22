package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.config.TaxConfig;
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
import java.util.stream.Collectors;

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
    private final TaxConfig taxConfig;
    private final CurrencyCodeGenerator currencyCodeGenerator;

    /**
     * Create a new asset with full Fineract provisioning.
     */
    @SuppressWarnings("unchecked")
    @Transactional
    @PreAuthorize("hasRole('ASSET_MANAGER')")
    public AssetDetailResponse createAsset(CreateAssetRequest request) {
        // Warn if caller still sends an explicit currencyCode (deprecated field)
        if (request.currencyCode() != null && !request.currencyCode().isBlank()) {
            log.warn("CreateAssetRequest.currencyCode is deprecated and will be ignored. " +
                    "The currency code is now auto-generated from symbol. " +
                    "Caller sent: '{}' for symbol '{}'", request.currencyCode(), request.symbol());
        }

        // Validate symbol uniqueness in local DB
        if (assetRepository.findBySymbol(request.symbol()).isPresent()) {
            throw new AssetException("Symbol already exists: " + request.symbol());
        }

        // Auto-generate a collision-safe currency code from the symbol.
        // Fetch registered codes once so CurrencyCodeGenerator can avoid them without extra API calls.
        List<Map<String, Object>> currencies = fineractClient.getExistingCurrencies();
        Set<String> registeredCurrencyCodes = currencies.stream()
                .map(c -> (String) c.get("code"))
                .filter(c -> c != null)
                .collect(Collectors.toSet());
        String effectiveCurrencyCode = currencyCodeGenerator.generate(request.symbol(), registeredCurrencyCodes);
        log.info("Auto-generated currency code '{}' for symbol '{}'", effectiveCurrencyCode, request.symbol());

        // Validate generated currency code is not already used locally
        if (assetRepository.findByCurrencyCode(effectiveCurrencyCode).isPresent()) {
            throw new AssetException("Currency code already exists: " + effectiveCurrencyCode);
        }

        // Check Fineract for orphaned savings product from a previously failed creation.
        // Strategy: adopt the orphan rather than blocking. If the product already exists in Fineract
        // but has no local Asset record, resume provisioning from that product ID.
        Integer existingProduct = fineractClient.findSavingsProductByShortName(request.symbol());
        boolean adoptingOrphan = existingProduct != null;
        if (adoptingOrphan) {
            // Safety check: ensure no local Asset is associated with this product ID
            if (assetRepository.existsByFineractProductId(existingProduct)) {
                throw new AssetException("A savings product with symbol '" + request.symbol()
                        + "' (productId=" + existingProduct + ") already has an active local asset record. "
                        + "Use a different symbol.");
            }
            log.warn("Adopting orphaned Fineract savings product {} for symbol '{}'. " +
                    "Resuming provisioning from existing product.", existingProduct, request.symbol());
        }

        // Derive effective ask/bid: use provided values, or auto-compute from issuerPrice ± spreadPercent
        BigDecimal effectiveSpread = request.spreadPercent() != null
                ? request.spreadPercent() : new BigDecimal("0.0030");
        BigDecimal effectiveAskPrice = request.lpAskPrice() != null
                ? request.lpAskPrice()
                : request.issuerPrice().multiply(BigDecimal.ONE.add(effectiveSpread)).setScale(0, RoundingMode.HALF_UP);
        BigDecimal effectiveBidPrice = request.lpBidPrice() != null
                ? request.lpBidPrice()
                : request.issuerPrice().multiply(BigDecimal.ONE.subtract(effectiveSpread)).setScale(0, RoundingMode.HALF_UP);

        // Validate pricing before provisioning any Fineract resources
        // ask >= issuerPrice must hold for all asset types: issuerPrice is the LP cost basis
        // and the spread leg clamps to max(0, executionPrice - issuerPrice), so a sub-cost
        // ask produces unrecoverable losses. For DISCOUNT bonds the discount is relative to
        // faceValue, not to issuerPrice; that invariant (faceValue > issuerPrice) is enforced
        // separately in validateBondFields below.
        if (effectiveAskPrice.compareTo(request.issuerPrice()) < 0) {
            throw new AssetException("Invalid pricing: ask price (" + effectiveAskPrice
                    + ") must be >= issuer price (" + request.issuerPrice() + ")");
        }
        if (effectiveBidPrice.compareTo(effectiveAskPrice) > 0) {
            throw new AssetException("Invalid spread: bid price (" + effectiveBidPrice
                    + ") must not exceed ask price (" + effectiveAskPrice + ")");
        }

        // Validate bond-specific fields when category is BONDS; reject bondType on all others
        if (request.bondType() != null && request.category() != AssetCategory.BONDS) {
            throw new AssetException(
                    "bondType is only valid for BONDS assets; received category=" + request.category());
        }
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
        Long lpTaxAccountId = null;

        try {
            // Step 1a: Create LP settlement account (LSAV product)
            Integer lsavProductId = fineractClient.findSavingsProductByShortName(
                    assetServiceConfig.getLpSettlementProductShortName());
            if (lsavProductId == null) {
                throw new AssetException("LP settlement savings product '"
                        + assetServiceConfig.getLpSettlementProductShortName()
                        + "' not found in Fineract. Please create it before provisioning assets.");
            }
            lpCashAccountId = fineractClient.provisionSavingsAccount(
                    request.lpClientId(), lsavProductId, null, null);
            log.info("Created LP settlement account (LSAV): {}", lpCashAccountId);

            // Step 1b: Create LP spread collection account (LSPD product)
            Integer lspdProductId = fineractClient.findSavingsProductByShortName(
                    assetServiceConfig.getLpSpreadProductShortName());
            if (lspdProductId == null) {
                throw new AssetException("LP spread savings product '"
                        + assetServiceConfig.getLpSpreadProductShortName()
                        + "' not found in Fineract. Please create it before provisioning assets.");
            }
            lpSpreadAccountId = fineractClient.provisionSavingsAccount(
                    request.lpClientId(), lspdProductId, null, null);
            log.info("Created LP spread collection account (LSPD): {}", lpSpreadAccountId);

            // Step 1c: Create LP tax withholding account (LTAX product)
            Integer ltaxProductId = fineractClient.findSavingsProductByShortName(
                    assetServiceConfig.getLpTaxProductShortName());
            if (ltaxProductId == null) {
                throw new AssetException("LP tax withholding savings product '"
                        + assetServiceConfig.getLpTaxProductShortName()
                        + "' not found in Fineract. Please create it before provisioning assets.");
            }
            lpTaxAccountId = fineractClient.provisionSavingsAccount(
                    request.lpClientId(), ltaxProductId, null, null);
            log.info("Created LP tax withholding account (LTAX): {}", lpTaxAccountId);

            // Step 2: Register custom currency in Fineract (idempotent — safe to call even if already registered)
            fineractClient.registerCurrencies(List.of(effectiveCurrencyCode));
            log.info("Registered currency: {}", effectiveCurrencyCode);

            // Step 3: Create savings product, or adopt the orphaned one if it already exists
            if (adoptingOrphan) {
                productId = existingProduct;
                log.info("Skipping savings product creation — adopting orphaned productId={}", productId);
            } else {
                // Fineract shortName: max 4 chars, derived from the auto-generated currency code (already 4 chars max)
                String shortName = effectiveCurrencyCode;
                productId = fineractClient.createSavingsProduct(
                        request.name() + " Token",
                        shortName,
                        effectiveCurrencyCode,
                        request.decimalPlaces(),
                        resolvedGlAccounts.getDigitalAssetInventoryId(),
                        resolvedGlAccounts.getCustomerDigitalAssetHoldingsId(),
                        resolvedGlAccounts.getTransfersInSuspenseId(),
                        resolvedGlAccounts.getIncomeFromInterestId(),
                        resolvedGlAccounts.getExpenseAccountId()
                );
                log.info("Created savings product: productId={}", productId);
            }

            // Step 4: Atomic account lifecycle — create, approve, activate, deposit initial supply
            // Uses Fineract Batch API (enclosingTransaction=true) so if any step fails, all are rolled back
            lpAssetAccountId = fineractClient.provisionSavingsAccount(
                    request.lpClientId(), productId,
                    request.totalSupply(), resolvedGlAccounts.getAssetIssuancePaymentTypeId()
            );
            log.info("Provisioned LP asset account atomically: accountId={}, supply={}",
                    lpAssetAccountId, request.totalSupply());

        } catch (AssetException e) {
            // When adopting an orphan, pass null productId so rollback does NOT delete the
            // pre-existing savings product — we didn't create it, so we must not destroy it.
            rollbackFineractResources(adoptingOrphan ? null : productId,
                    effectiveCurrencyCode, lpCashAccountId, lpSpreadAccountId, lpTaxAccountId, lpAssetAccountId, assetId);
            throw e;
        } catch (Exception e) {
            rollbackFineractResources(adoptingOrphan ? null : productId,
                    effectiveCurrencyCode, lpCashAccountId, lpSpreadAccountId, lpTaxAccountId, lpAssetAccountId, assetId);
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
                .faceValue(request.faceValue() != null ? request.faceValue() : request.issuerPrice())
                .decimalPlaces(request.decimalPlaces())
                .totalSupply(request.totalSupply())
                .circulatingSupply(BigDecimal.ZERO)
                .tradingFeePercent(request.tradingFeePercent() != null ? request.tradingFeePercent() : new BigDecimal("0.0030"))
                .bondType(request.bondType())
                .dayCountConvention(request.dayCountConvention() != null ? request.dayCountConvention()
                        : (request.bondType() == BondType.DISCOUNT ? DayCountConvention.ACT_360 : DayCountConvention.ACT_365))
                .issuerCountry(request.issuerCountry())
                .issuerName(request.issuerName())
                .isinCode(request.isinCode())
                .maturityDate(request.maturityDate())
                .issueDate(request.issueDate())
                .interestRate(request.interestRate())
                .couponFrequencyMonths(request.couponFrequencyMonths())
                .nextCouponDate(request.nextCouponDate())
                .lpClientId(request.lpClientId())
                .lpClientName(lpClientName)
                .lpAssetAccountId(lpAssetAccountId)
                .lpCashAccountId(lpCashAccountId)
                .lpSpreadAccountId(lpSpreadAccountId)
                .lpTaxAccountId(lpTaxAccountId)
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
                // Tax configuration — defaults: registration duty ON, TVA OFF, others OFF
                .registrationDutyEnabled(request.registrationDutyEnabled() != null ? request.registrationDutyEnabled() : true)
                .registrationDutyRate(request.registrationDutyRate() != null
                        ? request.registrationDutyRate() : taxConfig.getDefaultRegistrationDutyRate())
                .ircmEnabled(request.ircmEnabled() != null ? request.ircmEnabled() : false)
                .ircmRateOverride(request.ircmRateOverride())
                .ircmExempt(request.ircmExempt() != null ? request.ircmExempt() : false)
                .capitalGainsTaxEnabled(request.capitalGainsTaxEnabled() != null ? request.capitalGainsTaxEnabled() : false)
                .capitalGainsRate(request.capitalGainsRate() != null
                        ? request.capitalGainsRate() : taxConfig.getDefaultCapitalGainsRate())
                .isBvmacListed(request.isBvmacListed() != null ? request.isBvmacListed() : false)
                .isGovernmentBond(request.isGovernmentBond() != null ? request.isGovernmentBond() : false)
                // tvaEnabled: null → false (disabled by default); explicit true respected
                .tvaEnabled(Boolean.TRUE.equals(request.tvaEnabled()))
                .tvaRate(request.tvaRate() != null
                        ? request.tvaRate() : taxConfig.getDefaultTvaRate())
                .build();

        assetRepository.save(asset);

        // Step 6: Initialize price row with effective bid/ask prices
        AssetPrice price = AssetPrice.builder()
                .assetId(assetId)
                .dayOpen(effectiveAskPrice)
                .dayHigh(effectiveAskPrice)
                .dayLow(effectiveAskPrice)
                .dayClose(effectiveAskPrice)
                .bidPrice(effectiveBidPrice)
                .askPrice(effectiveAskPrice)
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

        // PENDING-only fields: reject early before any mutations
        boolean hasPendingOnlyField = request.issuerPrice() != null || request.faceValue() != null
                || request.totalSupply() != null
                || request.issuerName() != null || request.isinCode() != null
                || request.couponFrequencyMonths() != null || request.bondType() != null
                || request.dayCountConvention() != null || request.issuerCountry() != null;

        if (hasPendingOnlyField && asset.getStatus() != AssetStatus.PENDING) {
            throw new AssetException("Fields issuerPrice, totalSupply, issuerName, isinCode, couponFrequencyMonths, "
                    + "bondType, dayCountConvention, issuerCountry "
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

        // Tax configuration (with audit logging)
        if (request.registrationDutyEnabled() != null) {
            log.info("[TAX_CONFIG_CHANGE] asset={}, field=registrationDutyEnabled, old={}, new={}", assetId, asset.getRegistrationDutyEnabled(), request.registrationDutyEnabled());
            asset.setRegistrationDutyEnabled(request.registrationDutyEnabled());
        }
        if (request.registrationDutyRate() != null) {
            log.info("[TAX_CONFIG_CHANGE] asset={}, field=registrationDutyRate, old={}, new={}", assetId, asset.getRegistrationDutyRate(), request.registrationDutyRate());
            asset.setRegistrationDutyRate(request.registrationDutyRate());
        }
        if (request.ircmEnabled() != null) {
            log.info("[TAX_CONFIG_CHANGE] asset={}, field=ircmEnabled, old={}, new={}", assetId, asset.getIrcmEnabled(), request.ircmEnabled());
            asset.setIrcmEnabled(request.ircmEnabled());
        }
        if (request.ircmRateOverride() != null) {
            log.info("[TAX_CONFIG_CHANGE] asset={}, field=ircmRateOverride, old={}, new={}", assetId, asset.getIrcmRateOverride(), request.ircmRateOverride());
            asset.setIrcmRateOverride(request.ircmRateOverride());
        }
        if (request.ircmExempt() != null) {
            log.info("[TAX_CONFIG_CHANGE] asset={}, field=ircmExempt, old={}, new={}", assetId, asset.getIrcmExempt(), request.ircmExempt());
            asset.setIrcmExempt(request.ircmExempt());
        }
        if (request.capitalGainsTaxEnabled() != null) {
            log.info("[TAX_CONFIG_CHANGE] asset={}, field=capitalGainsTaxEnabled, old={}, new={}", assetId, asset.getCapitalGainsTaxEnabled(), request.capitalGainsTaxEnabled());
            asset.setCapitalGainsTaxEnabled(request.capitalGainsTaxEnabled());
        }
        if (request.capitalGainsRate() != null) {
            log.info("[TAX_CONFIG_CHANGE] asset={}, field=capitalGainsRate, old={}, new={}", assetId, asset.getCapitalGainsRate(), request.capitalGainsRate());
            asset.setCapitalGainsRate(request.capitalGainsRate());
        }
        if (request.isBvmacListed() != null) asset.setIsBvmacListed(request.isBvmacListed());
        if (request.isGovernmentBond() != null) asset.setIsGovernmentBond(request.isGovernmentBond());
        if (request.tvaEnabled() != null) {
            log.info("[TAX_CONFIG_CHANGE] asset={}, field=tvaEnabled, old={}, new={}", assetId, asset.getTvaEnabled(), request.tvaEnabled());
            asset.setTvaEnabled(request.tvaEnabled());
        }
        if (request.tvaRate() != null) {
            log.info("[TAX_CONFIG_CHANGE] asset={}, field=tvaRate, old={}, new={}", assetId, asset.getTvaRate(), request.tvaRate());
            asset.setTvaRate(request.tvaRate());
        }

        // Apply PENDING-only field mutations
        if (hasPendingOnlyField) {
            if (request.issuerPrice() != null) {
                asset.setIssuerPrice(request.issuerPrice());
                asset.setManualPrice(request.issuerPrice());
            }
            if (request.faceValue() != null) asset.setFaceValue(request.faceValue());
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
            if (request.bondType() != null) asset.setBondType(request.bondType());
            if (request.dayCountConvention() != null) asset.setDayCountConvention(request.dayCountConvention());
            if (request.issuerCountry() != null) asset.setIssuerCountry(request.issuerCountry());
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
     * Mint additional supply for an asset (deposit more tokens into LP inventory).
     */
    @Transactional
    @PreAuthorize("hasRole('ASSET_MANAGER')")
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
     * Delete a PENDING asset with full Fineract cleanup.
     * Only PENDING assets can be deleted — no trades, positions, or payments exist.
     */
    @Transactional
    @PreAuthorize("hasRole('ASSET_MANAGER')")
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
        if (request.bondType() == null) {
            throw new AssetException("Bond type (COUPON or DISCOUNT) is required for BONDS category");
        }

        if (request.bondType() == BondType.COUPON) {
            // OTA (T-Bonds): require coupon fields
            if (request.interestRate() == null) {
                throw new AssetException("Interest rate is required for COUPON bonds");
            }
            if (request.couponFrequencyMonths() == null) {
                throw new AssetException("Coupon frequency is required for COUPON bonds");
            }
            if (!Set.of(1, 3, 6, 12).contains(request.couponFrequencyMonths())) {
                throw new AssetException("Coupon frequency must be 1 (monthly), 3 (quarterly), 6 (semi-annual), or 12 (annual)");
            }
            if (request.nextCouponDate() == null) {
                throw new AssetException("First coupon date is required for COUPON bonds");
            }
            if (request.nextCouponDate().isAfter(request.maturityDate())) {
                throw new AssetException("First coupon date must be on or before the maturity date");
            }
        }

        if (request.bondType() == BondType.DISCOUNT) {
            // BTA: faceValue required and must be > issuerPrice
            if (request.faceValue() == null) {
                throw new AssetException("Face value (redemption price) is required for DISCOUNT bonds");
            }
            if (request.faceValue().compareTo(request.issuerPrice()) <= 0) {
                throw new AssetException("Face value must be greater than issuer price for DISCOUNT bonds");
            }
        }
    }

    /**
     * Best-effort rollback of Fineract resources created during provisioning.
     * Follows the same pattern as RegistrationService.rollback().
     */
    private void rollbackFineractResources(Integer productId, String currencyCode,
                                           Long lpCashAccountId, Long lpSpreadAccountId, Long lpTaxAccountId,
                                           Long lpAssetAccountId, String assetId) {
        log.info("Rolling back Fineract resources for asset {}...", assetId);

        // Close LP accounts (best-effort, same pattern as cleanupFineractResources)
        for (Long accountId : new Long[]{lpAssetAccountId, lpCashAccountId, lpSpreadAccountId, lpTaxAccountId}) {
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
