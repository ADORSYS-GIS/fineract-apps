package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.LiquidityProvider;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.LiquidityProviderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminLpService {

    private final LiquidityProviderRepository lpRepository;
    private final AssetRepository assetRepository;
    private final FineractClient fineractClient;
    private final AssetServiceConfig config;

    // NOT @Transactional — Fineract calls happen outside DB TX; a DB rollback cannot reverse them.
    // Duplicate-guard: we saveAndFlush a placeholder row first (PK = lpClientId).
    // If two concurrent calls race, one will get DataIntegrityViolationException before any Fineract calls.
    public LpDetailResponse createLp(CreateLpRequest request) {
        // Step 1: Atomically reserve the LP slot in the DB.
        // saveAndFlush opens its own transaction and commits immediately, so a concurrent
        // duplicate hits the primary-key constraint before any Fineract provisioning begins.
        LiquidityProvider placeholder = LiquidityProvider.builder()
                .clientId(request.lpClientId())
                .clientName(request.lpClientName())
                .build();
        try {
            lpRepository.saveAndFlush(placeholder);
        } catch (DataIntegrityViolationException e) {
            throw new AssetException("LP " + request.lpClientId() + " is already registered.");
        }

        // Step 2: Provision 3 Fineract accounts. On failure, delete the placeholder so the LP
        // can be re-registered after the underlying issue is resolved.
        try {
            Integer lsavId = fineractClient.findSavingsProductByShortName(config.getLpSettlementProductShortName());
            Integer lspdId = fineractClient.findSavingsProductByShortName(config.getLpSpreadProductShortName());
            Integer ltaxId = fineractClient.findSavingsProductByShortName(config.getLpTaxProductShortName());

            if (lsavId == null) throw new AssetException("Savings product '" + config.getLpSettlementProductShortName() + "' not found in Fineract.");
            if (lspdId == null) throw new AssetException("Savings product '" + config.getLpSpreadProductShortName() + "' not found in Fineract.");
            if (ltaxId == null) throw new AssetException("Savings product '" + config.getLpTaxProductShortName() + "' not found in Fineract.");

            FineractClient.LpAccountIds ids = fineractClient.provisionLpAccounts(
                    request.lpClientId(), lsavId, lspdId, ltaxId);

            String cashNo   = fineractClient.getSavingsAccountNo(ids.cashAccountId());
            String spreadNo = fineractClient.getSavingsAccountNo(ids.spreadAccountId());
            String taxNo    = fineractClient.getSavingsAccountNo(ids.taxAccountId());

            // Step 3: Update placeholder with the provisioned account IDs.
            placeholder.setCashAccountId(ids.cashAccountId());
            placeholder.setSpreadAccountId(ids.spreadAccountId());
            placeholder.setTaxAccountId(ids.taxAccountId());
            placeholder.setCashAccountNo(cashNo);
            placeholder.setSpreadAccountNo(spreadNo);
            placeholder.setTaxAccountNo(taxNo);
            lpRepository.save(placeholder);

            log.info("Registered LP {}: cash={}, spread={}, tax={}", request.lpClientId(),
                    ids.cashAccountId(), ids.spreadAccountId(), ids.taxAccountId());
            return toResponse(placeholder);
        } catch (Exception e) {
            // Fineract provisioning failed — remove placeholder so registration can be retried.
            lpRepository.deleteById(request.lpClientId());
            log.error("Failed to provision Fineract accounts for LP {}: {}", request.lpClientId(), e.getMessage());
            throw e instanceof AssetException ? (AssetException) e
                    : new AssetException("Failed to provision LP accounts: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public LpDetailResponse getLp(Long lpClientId) {
        return toResponse(load(lpClientId));
    }

    public LpShortfallResponse getShortfalls(Long lpClientId) {
        LiquidityProvider lp = load(lpClientId);
        List<Asset> assets = assetRepository.findByLpClientId(lpClientId);

        BigDecimal cashBalance = lp.getCashAccountId() != null
                ? fineractClient.getAccountBalance(lp.getCashAccountId())
                : BigDecimal.ZERO;

        List<LpShortfallEntry> entries = new ArrayList<>();
        BigDecimal totalObligation = BigDecimal.ZERO;

        for (Asset asset : assets) {
            BigDecimal obligation = computeObligation(asset);
            LocalDate dueDate = nextPaymentDate(asset);
            entries.add(new LpShortfallEntry(asset.getId(), asset.getSymbol(), asset.getName(), obligation, dueDate));
            totalObligation = totalObligation.add(obligation);
        }

        BigDecimal shortfall = totalObligation.subtract(cashBalance).max(BigDecimal.ZERO);
        return new LpShortfallResponse(lpClientId, lp.getClientName(), cashBalance, totalObligation, shortfall, entries);
    }

    private LiquidityProvider load(Long lpClientId) {
        return lpRepository.findById(lpClientId)
                .orElseThrow(() -> new AssetException("LP not found: " + lpClientId));
    }

    private LpDetailResponse toResponse(LiquidityProvider lp) {
        return new LpDetailResponse(
                lp.getClientId(), lp.getClientName(),
                lp.getCashAccountId(),   lp.getCashAccountNo(),
                lp.getSpreadAccountId(), lp.getSpreadAccountNo(),
                lp.getTaxAccountId(),    lp.getTaxAccountNo()
        );
    }

    private BigDecimal computeObligation(Asset asset) {
        if (asset.getNextCouponDate() != null && asset.getInterestRate() != null
                && asset.getFaceValue() != null) {
            // Coupon bond: obligation = LP inventory × faceValue × rate × period fraction
            // Simplified: use totalSupply as proxy since LP holds inventory
            BigDecimal supply = asset.getTotalSupply() != null ? asset.getTotalSupply() : BigDecimal.ZERO;
            BigDecimal periodFraction = BigDecimal.valueOf(6).divide(BigDecimal.valueOf(12), 10, java.math.RoundingMode.HALF_UP);
            return supply.multiply(asset.getFaceValue())
                    .multiply(asset.getInterestRate())
                    .multiply(periodFraction)
                    .setScale(2, java.math.RoundingMode.HALF_UP);
        }
        if (asset.getNextDistributionDate() != null && asset.getIncomeRate() != null
                && asset.getFaceValue() != null) {
            BigDecimal supply = asset.getTotalSupply() != null ? asset.getTotalSupply() : BigDecimal.ZERO;
            BigDecimal periodFraction = BigDecimal.valueOf(3).divide(BigDecimal.valueOf(12), 10, java.math.RoundingMode.HALF_UP);
            return supply.multiply(asset.getFaceValue())
                    .multiply(asset.getIncomeRate())
                    .multiply(periodFraction)
                    .setScale(2, java.math.RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    private LocalDate nextPaymentDate(Asset asset) {
        if (asset.getNextCouponDate() != null) return asset.getNextCouponDate();
        if (asset.getNextDistributionDate() != null) return asset.getNextDistributionDate();
        return null;
    }
}
