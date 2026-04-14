package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.dto.PaymentResultResponse;
import com.adorsys.fineract.asset.dto.PaymentSummaryResponse;
import com.adorsys.fineract.asset.entity.IncomeDistribution;
import com.adorsys.fineract.asset.entity.InterestPayment;
import com.adorsys.fineract.asset.entity.ScheduledPayment;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.*;
import com.adorsys.fineract.asset.testutil.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ScheduledPaymentServiceTest {

    @Mock private ScheduledPaymentRepository scheduledPaymentRepository;
    @Mock private AssetRepository assetRepository;
    @Mock private AssetPriceRepository assetPriceRepository;
    @Mock private UserPositionRepository userPositionRepository;
    @Mock private InterestPaymentRepository interestPaymentRepository;
    @Mock private IncomeDistributionRepository incomeDistributionRepository;
    @Mock private FineractClient fineractClient;
    @Mock private AssetServiceConfig assetServiceConfig;
    @Mock private AssetMetrics assetMetrics;
    @Mock private ApplicationEventPublisher eventPublisher;
    @Mock private TaxService taxService;
    @Mock private ResolvedGlAccounts resolvedGlAccounts;

    @InjectMocks private ScheduledPaymentService service;

    // ── getPaymentResults ────────────────────────────────────────────────

    @Test
    void getPaymentResults_couponType_queriesInterestPaymentRepo() {
        ScheduledPayment schedule = TestDataFactory.scheduledPayment(TestDataFactory.ASSET_ID, "COUPON");
        InterestPayment ip = TestDataFactory.interestPayment(TestDataFactory.ASSET_ID, TestDataFactory.USER_ID);
        Pageable pageable = PageRequest.of(0, 20);

        when(scheduledPaymentRepository.findById(1L)).thenReturn(Optional.of(schedule));
        when(interestPaymentRepository.findByAssetIdAndCouponDateOrderByPaidAtDesc(
                eq(TestDataFactory.ASSET_ID), eq(LocalDate.now()), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(ip)));

        Page<PaymentResultResponse> result = service.getPaymentResults(1L, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).userId()).isEqualTo(TestDataFactory.USER_ID);
        assertThat(result.getContent().get(0).faceValue()).isNotNull();
        assertThat(result.getContent().get(0).incomeType()).isNull();
        verify(interestPaymentRepository).findByAssetIdAndCouponDateOrderByPaidAtDesc(
                eq(TestDataFactory.ASSET_ID), any(LocalDate.class), eq(pageable));
    }

    @Test
    void getPaymentResults_incomeType_queriesIncomeDistributionRepo() {
        ScheduledPayment schedule = TestDataFactory.scheduledPayment(TestDataFactory.ASSET_ID, "INCOME");
        IncomeDistribution id = TestDataFactory.incomeDistribution(TestDataFactory.ASSET_ID, TestDataFactory.USER_ID);
        Pageable pageable = PageRequest.of(0, 20);

        when(scheduledPaymentRepository.findById(1L)).thenReturn(Optional.of(schedule));
        when(incomeDistributionRepository.findByAssetIdAndDistributionDateOrderByPaidAtDesc(
                eq(TestDataFactory.ASSET_ID), eq(LocalDate.now()), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(id)));

        Page<PaymentResultResponse> result = service.getPaymentResults(1L, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).incomeType()).isEqualTo("DIVIDEND");
        assertThat(result.getContent().get(0).faceValue()).isNull();
        verify(incomeDistributionRepository).findByAssetIdAndDistributionDateOrderByPaidAtDesc(
                eq(TestDataFactory.ASSET_ID), any(LocalDate.class), eq(pageable));
    }

    @Test
    void getPaymentResults_scheduleNotFound_throwsException() {
        when(scheduledPaymentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getPaymentResults(999L, PageRequest.of(0, 20)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("999");
    }

    // ── getPaymentSummary ────────────────────────────────────────────────

    @Test
    void getPaymentSummary_coupon_returnsSummary() {
        InterestPayment lastPayment = TestDataFactory.interestPayment(TestDataFactory.ASSET_ID, TestDataFactory.USER_ID);

        when(interestPaymentRepository.findFirstByAssetIdAndStatusOrderByPaidAtDesc(
                TestDataFactory.ASSET_ID, "SUCCESS")).thenReturn(Optional.of(lastPayment));
        when(interestPaymentRepository.sumPaidByAsset(TestDataFactory.ASSET_ID))
                .thenReturn(new BigDecimal("2900"));
        when(interestPaymentRepository.countFailedByAsset(TestDataFactory.ASSET_ID)).thenReturn(0L);
        when(interestPaymentRepository.countByAssetId(TestDataFactory.ASSET_ID)).thenReturn(1L);
        when(scheduledPaymentRepository.findFirstByAssetIdAndPaymentTypeAndStatusOrderByScheduleDateAsc(
                TestDataFactory.ASSET_ID, "COUPON", "PENDING")).thenReturn(Optional.empty());

        PaymentSummaryResponse summary = service.getPaymentSummary(TestDataFactory.ASSET_ID, "COUPON");

        assertThat(summary.lastPaymentDate()).isEqualTo(LocalDate.now());
        assertThat(summary.totalPaidToDate()).isEqualByComparingTo(new BigDecimal("2900"));
        assertThat(summary.failedPaymentCount()).isZero();
        assertThat(summary.totalPaymentCount()).isEqualTo(1);
        assertThat(summary.nextScheduledDate()).isNull();
    }

    @Test
    void getPaymentSummary_income_returnsSummary() {
        IncomeDistribution lastPayment = TestDataFactory.incomeDistribution(TestDataFactory.ASSET_ID, TestDataFactory.USER_ID);
        ScheduledPayment nextSchedule = TestDataFactory.scheduledPayment(TestDataFactory.ASSET_ID, "INCOME");

        when(incomeDistributionRepository.findFirstByAssetIdAndStatusOrderByPaidAtDesc(
                TestDataFactory.ASSET_ID, "SUCCESS")).thenReturn(Optional.of(lastPayment));
        when(incomeDistributionRepository.sumPaidByAsset(TestDataFactory.ASSET_ID))
                .thenReturn(new BigDecimal("800"));
        when(incomeDistributionRepository.countFailedByAsset(TestDataFactory.ASSET_ID)).thenReturn(0L);
        when(incomeDistributionRepository.countByAssetId(TestDataFactory.ASSET_ID)).thenReturn(1L);
        when(scheduledPaymentRepository.findFirstByAssetIdAndPaymentTypeAndStatusOrderByScheduleDateAsc(
                TestDataFactory.ASSET_ID, "INCOME", "PENDING")).thenReturn(Optional.of(nextSchedule));

        PaymentSummaryResponse summary = service.getPaymentSummary(TestDataFactory.ASSET_ID, "INCOME");

        assertThat(summary.totalPaidToDate()).isEqualByComparingTo(new BigDecimal("800"));
        assertThat(summary.nextScheduledDate()).isEqualTo(LocalDate.now());
    }

    @Test
    void getPaymentSummary_noPayments_returnsZeros() {
        when(interestPaymentRepository.findFirstByAssetIdAndStatusOrderByPaidAtDesc(
                TestDataFactory.ASSET_ID, "SUCCESS")).thenReturn(Optional.empty());
        when(interestPaymentRepository.sumPaidByAsset(TestDataFactory.ASSET_ID)).thenReturn(BigDecimal.ZERO);
        when(interestPaymentRepository.countFailedByAsset(TestDataFactory.ASSET_ID)).thenReturn(0L);
        when(interestPaymentRepository.countByAssetId(TestDataFactory.ASSET_ID)).thenReturn(0L);
        when(scheduledPaymentRepository.findFirstByAssetIdAndPaymentTypeAndStatusOrderByScheduleDateAsc(
                TestDataFactory.ASSET_ID, "COUPON", "PENDING")).thenReturn(Optional.empty());

        PaymentSummaryResponse summary = service.getPaymentSummary(TestDataFactory.ASSET_ID, "COUPON");

        assertThat(summary.lastPaymentDate()).isNull();
        assertThat(summary.lastPaymentAmountPaid()).isNull();
        assertThat(summary.totalPaidToDate()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(summary.failedPaymentCount()).isZero();
        assertThat(summary.totalPaymentCount()).isZero();
        assertThat(summary.nextScheduledDate()).isNull();
    }

    @Test
    void getPaymentSummary_noPendingSchedule_returnsNullNextDate() {
        InterestPayment lastPayment = TestDataFactory.interestPayment(TestDataFactory.ASSET_ID, TestDataFactory.USER_ID);

        when(interestPaymentRepository.findFirstByAssetIdAndStatusOrderByPaidAtDesc(
                TestDataFactory.ASSET_ID, "SUCCESS")).thenReturn(Optional.of(lastPayment));
        when(interestPaymentRepository.sumPaidByAsset(TestDataFactory.ASSET_ID))
                .thenReturn(new BigDecimal("2900"));
        when(interestPaymentRepository.countFailedByAsset(TestDataFactory.ASSET_ID)).thenReturn(1L);
        when(interestPaymentRepository.countByAssetId(TestDataFactory.ASSET_ID)).thenReturn(2L);
        when(scheduledPaymentRepository.findFirstByAssetIdAndPaymentTypeAndStatusOrderByScheduleDateAsc(
                TestDataFactory.ASSET_ID, "COUPON", "PENDING")).thenReturn(Optional.empty());

        PaymentSummaryResponse summary = service.getPaymentSummary(TestDataFactory.ASSET_ID, "COUPON");

        assertThat(summary.nextScheduledDate()).isNull();
        assertThat(summary.failedPaymentCount()).isEqualTo(1);
        assertThat(summary.totalPaymentCount()).isEqualTo(2);
    }
}
