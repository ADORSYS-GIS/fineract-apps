package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.BatchJournalEntryOp;
import com.adorsys.fineract.asset.client.FineractClient.BatchOperation;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.dto.PaymentResultResponse;
import com.adorsys.fineract.asset.dto.PaymentSummaryResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.IncomeDistribution;
import com.adorsys.fineract.asset.entity.InterestPayment;
import com.adorsys.fineract.asset.entity.ScheduledPayment;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.*;
import com.adorsys.fineract.asset.testutil.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
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
import java.util.Collections;
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
    @Mock private ResolvedGlAccounts resolvedGlAccounts;
    @Mock private TaxService taxService;
    @Mock private AssetMetrics assetMetrics;
    @Mock private ApplicationEventPublisher eventPublisher;

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

    // ── confirmPayment: GL expense entry ─────────────────────────────────

    @SuppressWarnings("unchecked")
    @Test
    void confirmPayment_coupon_producesExpenseGlEntry() {
        // Arrange
        Long EXPENSE_GL_ID = 1091L;
        Long FUND_SOURCE_GL_ID = 1042L;
        Long IRCM_GL_ID = 1094L;

        ScheduledPayment schedule = TestDataFactory.scheduledPayment(TestDataFactory.ASSET_ID, "COUPON");
        Asset bond = TestDataFactory.activeBondAsset();
        UserPosition holder = TestDataFactory.userPosition(TestDataFactory.USER_ID, TestDataFactory.ASSET_ID, new BigDecimal("10"));

        when(scheduledPaymentRepository.findWithAssetById(1L)).thenReturn(Optional.of(schedule));
        when(assetRepository.findById(TestDataFactory.ASSET_ID)).thenReturn(Optional.of(bond));
        when(userPositionRepository.findHoldersByAssetId(eq(TestDataFactory.ASSET_ID), any()))
                .thenReturn(List.of(holder));
        when(fineractClient.getAccountBalance(bond.getLpCashAccountId()))
                .thenReturn(new BigDecimal("1000000"));
        when(assetServiceConfig.getSettlementCurrency()).thenReturn("XAF");
        when(fineractClient.findClientSavingsAccountByCurrency(TestDataFactory.USER_ID, "XAF"))
                .thenReturn(TestDataFactory.USER_CASH_ACCOUNT);
        when(taxService.getEffectiveIrcmRate(bond)).thenReturn(new BigDecimal("0.15"));
        when(taxService.calculateIrcm(eq(bond), any())).thenReturn(new BigDecimal("435"));
        when(taxService.getIrcmAccountId()).thenReturn(777L);
        when(resolvedGlAccounts.getExpenseAccountId()).thenReturn(EXPENSE_GL_ID);
        when(resolvedGlAccounts.getFundSourceId()).thenReturn(FUND_SOURCE_GL_ID);
        when(resolvedGlAccounts.getTaxExpenseIrcmId()).thenReturn(IRCM_GL_ID);
        when(fineractClient.executeAtomicBatch(any())).thenReturn(
                List.of(Collections.singletonMap("resourceId", 1L)));

        // Act
        service.confirmPayment(1L, null, "admin");

        // Assert: capture batch operations
        ArgumentCaptor<List<BatchOperation>> captor = ArgumentCaptor.forClass(List.class);
        verify(fineractClient).executeAtomicBatch(captor.capture());
        List<BatchOperation> ops = captor.getValue();

        // Verify expense GL entry exists: DR Expense (GL 91), CR Fund Source (GL 42)
        List<BatchJournalEntryOp> journalEntries = ops.stream()
                .filter(op -> op instanceof BatchJournalEntryOp)
                .map(op -> (BatchJournalEntryOp) op)
                .toList();

        // Should have both IRCM tax expense AND interest expense GL entries
        BatchJournalEntryOp expenseJe = journalEntries.stream()
                .filter(je -> je.debitGlAccountId().equals(EXPENSE_GL_ID)
                        && je.creditGlAccountId().equals(FUND_SOURCE_GL_ID))
                .findFirst()
                .orElse(null);
        assertThat(expenseJe).as("Should have interest expense GL entry").isNotNull();
        // Gross amount = 10 units × 290 per unit = 2900
        assertThat(expenseJe.amount()).isEqualByComparingTo(new BigDecimal("2900"));
        assertThat(expenseJe.comments()).contains("Interest expense");
        assertThat(expenseJe.comments()).contains(String.valueOf(TestDataFactory.USER_ID));
        assertThat(expenseJe.currencyCode()).isEqualTo("XAF");

        // Also verify IRCM GL entry
        BatchJournalEntryOp ircmJe = journalEntries.stream()
                .filter(je -> je.debitGlAccountId().equals(IRCM_GL_ID)
                        && je.creditGlAccountId().equals(FUND_SOURCE_GL_ID))
                .findFirst()
                .orElse(null);
        assertThat(ircmJe).as("Should have IRCM tax expense GL entry").isNotNull();
        assertThat(ircmJe.amount()).isEqualByComparingTo(new BigDecimal("435"));
    }

    @SuppressWarnings("unchecked")
    @Test
    void confirmPayment_income_producesExpenseGlEntry() {
        // Arrange
        Long EXPENSE_GL_ID = 1091L;
        Long FUND_SOURCE_GL_ID = 1042L;
        Long IRCM_GL_ID = 1094L;

        ScheduledPayment schedule = TestDataFactory.scheduledPayment(TestDataFactory.ASSET_ID, "INCOME");
        Asset asset = TestDataFactory.activeAsset();
        asset.setIncomeType("DIVIDEND");
        asset.setIncomeRate(new BigDecimal("8.00"));
        UserPosition holder = TestDataFactory.userPosition(TestDataFactory.USER_ID, TestDataFactory.ASSET_ID, new BigDecimal("10"));

        when(scheduledPaymentRepository.findWithAssetById(1L)).thenReturn(Optional.of(schedule));
        when(assetRepository.findById(TestDataFactory.ASSET_ID)).thenReturn(Optional.of(asset));
        when(userPositionRepository.findHoldersByAssetId(eq(TestDataFactory.ASSET_ID), any()))
                .thenReturn(List.of(holder));
        when(fineractClient.getAccountBalance(asset.getLpCashAccountId()))
                .thenReturn(new BigDecimal("1000000"));
        when(assetServiceConfig.getSettlementCurrency()).thenReturn("XAF");
        when(fineractClient.findClientSavingsAccountByCurrency(TestDataFactory.USER_ID, "XAF"))
                .thenReturn(TestDataFactory.USER_CASH_ACCOUNT);
        when(taxService.getEffectiveIrcmRate(asset)).thenReturn(new BigDecimal("0.15"));
        when(taxService.calculateIrcm(eq(asset), any())).thenReturn(new BigDecimal("435"));
        when(taxService.getIrcmAccountId()).thenReturn(777L);
        when(resolvedGlAccounts.getExpenseAccountId()).thenReturn(EXPENSE_GL_ID);
        when(resolvedGlAccounts.getFundSourceId()).thenReturn(FUND_SOURCE_GL_ID);
        when(resolvedGlAccounts.getTaxExpenseIrcmId()).thenReturn(IRCM_GL_ID);
        when(fineractClient.executeAtomicBatch(any())).thenReturn(
                List.of(Collections.singletonMap("resourceId", 1L)));

        // Act
        service.confirmPayment(1L, null, "admin");

        // Assert: capture batch operations
        ArgumentCaptor<List<BatchOperation>> captor = ArgumentCaptor.forClass(List.class);
        verify(fineractClient).executeAtomicBatch(captor.capture());
        List<BatchOperation> ops = captor.getValue();

        List<BatchJournalEntryOp> journalEntries = ops.stream()
                .filter(op -> op instanceof BatchJournalEntryOp)
                .map(op -> (BatchJournalEntryOp) op)
                .toList();

        // Should have income expense GL entry: DR Expense (GL 91), CR Fund Source (GL 42)
        BatchJournalEntryOp expenseJe = journalEntries.stream()
                .filter(je -> je.debitGlAccountId().equals(EXPENSE_GL_ID)
                        && je.creditGlAccountId().equals(FUND_SOURCE_GL_ID))
                .findFirst()
                .orElse(null);
        assertThat(expenseJe).as("Should have income expense GL entry").isNotNull();
        // Gross amount = 10 units × 290 per unit = 2900
        assertThat(expenseJe.amount()).isEqualByComparingTo(new BigDecimal("2900"));
        assertThat(expenseJe.comments()).contains("Income expense");
        assertThat(expenseJe.comments()).contains("DIVIDEND");
        assertThat(expenseJe.currencyCode()).isEqualTo("XAF");
    }
}
