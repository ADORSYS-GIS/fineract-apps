package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.IncomeDistribution;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.event.IncomePaidEvent;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.IncomeDistributionRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

/**
 * Processes income distributions (dividends, rent, harvest yields) for non-bond assets.
 * Follows the same pattern as InterestPaymentScheduler but for generic income types.
 *
 * Formula: cashAmount = units * currentPrice * (incomeRate / 100) * (frequencyMonths / 12)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class IncomeDistributionService {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final UserPositionRepository userPositionRepository;
    private final IncomeDistributionRepository incomeDistributionRepository;
    private final FineractClient fineractClient;
    private final AssetServiceConfig assetServiceConfig;
    private final ApplicationEventPublisher eventPublisher;
    private final AssetMetrics assetMetrics;

    @Transactional
    public void processDistribution(Asset asset, LocalDate distributionDate) {
        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                asset.getId(), BigDecimal.ZERO);

        if (holders.isEmpty()) {
            log.info("No holders for asset {} — skipping distribution, advancing date", asset.getId());
            advanceDistributionDate(asset);
            return;
        }

        BigDecimal currentPrice = assetPriceRepository.findById(asset.getId())
                .map(p -> p.getCurrentPrice())
                .orElse(BigDecimal.ZERO);

        BigDecimal rate = asset.getIncomeRate();
        int frequencyMonths = asset.getDistributionFrequencyMonths();
        String incomeType = asset.getIncomeType();

        log.info("Processing {} distribution for asset {}: {} holders, rate={}%, frequency={}m, price={}",
                incomeType, asset.getSymbol(), holders.size(), rate, frequencyMonths, currentPrice);

        int successCount = 0;
        int failCount = 0;
        BigDecimal totalPaid = BigDecimal.ZERO;

        for (UserPosition holder : holders) {
            // cashAmount = units * currentPrice * (rate/100) * (frequencyMonths/12)
            BigDecimal cashAmount = holder.getTotalUnits()
                    .multiply(currentPrice)
                    .multiply(rate)
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(frequencyMonths))
                    .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);

            if (cashAmount.compareTo(BigDecimal.ZERO) <= 0) continue;

            boolean success = payHolder(asset, holder, incomeType, rate, cashAmount, distributionDate);
            if (success) {
                successCount++;
                totalPaid = totalPaid.add(cashAmount);
            } else {
                failCount++;
            }
        }

        log.info("Asset {} {} distribution complete: {} paid, {} failed, total={} {}",
                asset.getSymbol(), incomeType, successCount, failCount,
                totalPaid, assetServiceConfig.getSettlementCurrency());

        advanceDistributionDate(asset);
    }

    private boolean payHolder(Asset asset, UserPosition holder, String incomeType,
                               BigDecimal rate, BigDecimal cashAmount, LocalDate distributionDate) {
        String currency = assetServiceConfig.getSettlementCurrency();
        IncomeDistribution.IncomeDistributionBuilder record = IncomeDistribution.builder()
                .assetId(asset.getId())
                .userId(holder.getUserId())
                .incomeType(incomeType)
                .units(holder.getTotalUnits())
                .rateApplied(rate)
                .cashAmount(cashAmount)
                .distributionDate(distributionDate);

        try {
            Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(
                    holder.getUserId(), currency);
            if (userCashAccountId == null) {
                throw new RuntimeException("No active " + currency + " account for user " + holder.getUserId());
            }

            String description = String.format("%s payment: %s %s%%",
                    incomeType, asset.getSymbol(), rate);
            Long transferId = fineractClient.createAccountTransfer(
                    asset.getTreasuryCashAccountId(), userCashAccountId,
                    cashAmount, description);

            record.fineractTransferId(transferId).status("SUCCESS");
            assetMetrics.recordIncomeDistributed(asset.getId(), incomeType, cashAmount.doubleValue());

            eventPublisher.publishEvent(new IncomePaidEvent(
                    holder.getUserId(), asset.getId(), asset.getSymbol(),
                    incomeType, cashAmount, distributionDate));

            incomeDistributionRepository.save(record.build());
            return true;

        } catch (Exception e) {
            record.status("FAILED").failureReason(truncate(e.getMessage(), 500));
            assetMetrics.recordIncomeDistributionFailed(asset.getId(), incomeType);
            log.error("{} payment failed: asset={}, user={}, amount={} {}, error={}",
                    incomeType, asset.getSymbol(), holder.getUserId(), cashAmount, currency, e.getMessage());
            incomeDistributionRepository.save(record.build());
            return false;
        }
    }

    private void advanceDistributionDate(Asset asset) {
        LocalDate nextDate = asset.getNextDistributionDate()
                .plusMonths(asset.getDistributionFrequencyMonths());
        asset.setNextDistributionDate(nextDate);
        assetRepository.save(asset);
        log.info("Asset {} next distribution date advanced to {}", asset.getSymbol(), nextDate);
    }

    private static String truncate(String s, int maxLen) {
        return s != null && s.length() > maxLen ? s.substring(0, maxLen) : s;
    }
}
