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
    public LpDetailResponse createLp(CreateLpRequest request) {
        if (lpRepository.existsById(request.lpClientId())) {
            throw new AssetException("LP " + request.lpClientId() + " is already registered.");
        }

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

        LiquidityProvider lp = LiquidityProvider.builder()
                .clientId(request.lpClientId())
                .clientName(request.lpClientName())
                .cashAccountId(ids.cashAccountId())
                .spreadAccountId(ids.spreadAccountId())
                .taxAccountId(ids.taxAccountId())
                .cashAccountNo(cashNo)
                .spreadAccountNo(spreadNo)
                .taxAccountNo(taxNo)
                .build();
        lpRepository.save(lp);

        log.info("Registered LP {}: cash={}, spread={}, tax={}", request.lpClientId(),
                ids.cashAccountId(), ids.spreadAccountId(), ids.taxAccountId());
        return toResponse(lp);
    }

    @Transactional(readOnly = true)
    public LpDetailResponse getLp(Long lpClientId) {
        return toResponse(load(lpClientId));
    }

    @Transactional(readOnly = true)
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
