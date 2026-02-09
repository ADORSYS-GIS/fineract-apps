package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
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

    // GL account IDs - these map to the GitOps-provisioned GL accounts
    private static final Long GL_DIGITAL_ASSET_INVENTORY = 47L;
    private static final Long GL_CUSTOMER_DIGITAL_ASSET_HOLDINGS = 65L;

    // Payment type for asset issuance (position 22 in GitOps)
    private static final Long ASSET_ISSUANCE_PAYMENT_TYPE = 22L;

    /**
     * Create a new asset with full Fineract provisioning.
     */
    @SuppressWarnings("unchecked")
    @Transactional
    public AssetDetailResponse createAsset(CreateAssetRequest request) {
        // Validate uniqueness
        if (assetRepository.findBySymbol(request.symbol()).isPresent()) {
            throw new AssetException("Symbol already exists: " + request.symbol());
        }
        if (assetRepository.findByCurrencyCode(request.currencyCode()).isPresent()) {
            throw new AssetException("Currency code already exists: " + request.currencyCode());
        }

        String assetId = UUID.randomUUID().toString();
        log.info("Creating asset: id={}, symbol={}, currency={}", assetId, request.symbol(), request.currencyCode());

        Integer productId = null;
        Long treasuryAssetAccountId = null;
        Long treasuryCashAccountId = null;

        try {
            // Step 1: Auto-derive treasury XAF cash account
            List<Map<String, Object>> accounts = fineractClient.getClientSavingsAccounts(request.treasuryClientId());
            treasuryCashAccountId = accounts.stream()
                    .filter(a -> {
                        Map<String, Object> currency = (Map<String, Object>) a.get("currency");
                        Map<String, Object> status = (Map<String, Object>) a.get("status");
                        return currency != null && "XAF".equals(currency.get("code"))
                                && status != null && Boolean.TRUE.equals(status.get("active"));
                    })
                    .map(a -> ((Number) a.get("id")).longValue())
                    .findFirst()
                    .orElseThrow(() -> new AssetException(
                            "No active XAF savings account found for company (client ID: " + request.treasuryClientId()
                            + "). Please create and approve a XAF savings account for this company in the Account Manager before creating an asset."));
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
                    GL_DIGITAL_ASSET_INVENTORY,
                    GL_CUSTOMER_DIGITAL_ASSET_HOLDINGS
            );
            log.info("Created savings product: productId={}", productId);

            // Step 4: Create treasury savings account for the company
            treasuryAssetAccountId = fineractClient.createSavingsAccount(
                    request.treasuryClientId(), productId
            );
            log.info("Created treasury asset account: accountId={}", treasuryAssetAccountId);

            // Step 5: Approve treasury account
            fineractClient.approveSavingsAccount(treasuryAssetAccountId);

            // Step 6: Activate treasury account
            fineractClient.activateSavingsAccount(treasuryAssetAccountId);

            // Step 7: Deposit initial supply into treasury
            fineractClient.depositToSavingsAccount(
                    treasuryAssetAccountId, request.totalSupply(), ASSET_ISSUANCE_PAYMENT_TYPE
            );
            log.info("Deposited initial supply: {} units into treasury account {}", request.totalSupply(), treasuryAssetAccountId);

        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Fineract provisioning failed for asset {}: {}. " +
                       "Manual cleanup may be required. productId={}, treasuryAccountId={}",
                    assetId, e.getMessage(), productId, treasuryAssetAccountId);
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

        return new AssetCatalogService(assetRepository, assetPriceRepository).getAssetDetail(assetId);
    }

    /**
     * Update asset metadata.
     */
    @Transactional
    public AssetDetailResponse updateAsset(String assetId, UpdateAssetRequest request) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        if (request.name() != null) asset.setName(request.name());
        if (request.description() != null) asset.setDescription(request.description());
        if (request.imageUrl() != null) asset.setImageUrl(request.imageUrl());
        if (request.category() != null) asset.setCategory(request.category());
        if (request.tradingFeePercent() != null) asset.setTradingFeePercent(request.tradingFeePercent());
        if (request.spreadPercent() != null) asset.setSpreadPercent(request.spreadPercent());

        assetRepository.save(asset);
        log.info("Updated asset: id={}", assetId);

        return new AssetCatalogService(assetRepository, assetPriceRepository).getAssetDetail(assetId);
    }

    /**
     * Activate an asset (PENDING -> ACTIVE).
     */
    @Transactional
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
    public void mintSupply(String assetId, MintSupplyRequest request) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        // Deposit additional units into treasury via Fineract
        fineractClient.depositToSavingsAccount(
                asset.getTreasuryAssetAccountId(),
                request.additionalSupply(),
                ASSET_ISSUANCE_PAYMENT_TYPE);

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
}
