package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

import static com.adorsys.fineract.asset.testutil.TestDataFactory.activeDiscountBondAsset;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BtaPriceAccretionSchedulerTest {

    @Mock AssetRepository assetRepository;
    @Mock AssetPriceRepository assetPriceRepository;
    @Mock ApplicationEventPublisher eventPublisher;

    @InjectMocks BtaPriceAccretionScheduler scheduler;

    private AssetPrice priceFor(Asset bond, BigDecimal ask, BigDecimal bid) {
        return AssetPrice.builder()
                .assetId(bond.getId())
                .askPrice(ask)
                .bidPrice(bid)
                .dayHigh(ask)
                .dayLow(ask)
                .build();
    }

    @Test
    void accreteBond_normal_computesHigherThanIssuerPrice() {
        // face = 1,100,000 (10% above issuerPrice 1,000,000), maturity in 260 days
        Asset bond = activeDiscountBondAsset();
        bond.setFaceValue(new BigDecimal("1100000"));
        bond.setIssuerPrice(new BigDecimal("1000000"));
        bond.setIssueDate(LocalDate.now().minusDays(104));
        bond.setMaturityDate(LocalDate.now().plusDays(260));

        AssetPrice price = priceFor(bond, new BigDecimal("1000000"), new BigDecimal("980000"));
        when(assetPriceRepository.findById(bond.getId())).thenReturn(Optional.of(price));

        boolean updated = scheduler.accreteBond(bond, LocalDate.now());

        assertTrue(updated);
        // Theoretical price must be > issuerPrice (bond has accreted) and < faceValue (not matured)
        assertTrue(price.getAskPrice().compareTo(new BigDecimal("1000000")) > 0,
                "Ask should be above issuer price, was: " + price.getAskPrice());
        assertTrue(price.getAskPrice().compareTo(new BigDecimal("1100000")) < 0,
                "Ask should be below face value, was: " + price.getAskPrice());
        verify(assetPriceRepository).save(price);
    }

    @Test
    void accreteBond_maintainsBidRatio() {
        // bid/ask ratio ≈ 0.98 — should be preserved after accretion
        Asset bond = activeDiscountBondAsset();
        bond.setFaceValue(new BigDecimal("1100000"));
        bond.setIssuerPrice(new BigDecimal("1000000"));
        bond.setIssueDate(LocalDate.now().minusDays(100));
        bond.setMaturityDate(LocalDate.now().plusDays(264));

        BigDecimal originalAsk = new BigDecimal("1010000");
        BigDecimal originalBid = new BigDecimal("989800"); // ratio = 0.98
        AssetPrice price = priceFor(bond, originalAsk, originalBid);
        when(assetPriceRepository.findById(bond.getId())).thenReturn(Optional.of(price));

        scheduler.accreteBond(bond, LocalDate.now());

        BigDecimal newAsk = price.getAskPrice();
        BigDecimal newBid = price.getBidPrice();
        // bid < ask always
        assertTrue(newBid.compareTo(newAsk) < 0, "Bid must be strictly less than ask");
        // ratio should stay close to 0.98 (within 1%)
        BigDecimal newRatio = newBid.divide(newAsk, 4, RoundingMode.HALF_UP);
        assertTrue(newRatio.compareTo(new BigDecimal("0.97")) > 0,
                "Bid ratio too low: " + newRatio);
        assertTrue(newRatio.compareTo(new BigDecimal("0.99")) < 0,
                "Bid ratio too high: " + newRatio);
    }

    @Test
    void accreteBond_noPriceRecord_returnsFalse() {
        Asset bond = activeDiscountBondAsset();
        when(assetPriceRepository.findById(bond.getId())).thenReturn(Optional.empty());

        boolean updated = scheduler.accreteBond(bond, LocalDate.now());

        assertFalse(updated);
        verify(assetPriceRepository, never()).save(any());
    }

    @Test
    void accreteBond_faceValueNotAboveIssuerPrice_returnsFalse() {
        // face ≤ issuer → degenerate, not a real discount bond
        Asset bond = activeDiscountBondAsset();
        bond.setFaceValue(new BigDecimal("1000000")); // equal to issuerPrice
        bond.setIssuerPrice(new BigDecimal("1000000"));

        AssetPrice price = priceFor(bond, new BigDecimal("1000000"), new BigDecimal("980000"));
        when(assetPriceRepository.findById(bond.getId())).thenReturn(Optional.of(price));

        boolean updated = scheduler.accreteBond(bond, LocalDate.now());

        assertFalse(updated);
        verify(assetPriceRepository, never()).save(any());
    }

    @Test
    void accreteBond_alreadyMatured_returnsFalse() {
        Asset bond = activeDiscountBondAsset();
        bond.setFaceValue(new BigDecimal("1100000"));
        bond.setIssuerPrice(new BigDecimal("1000000"));
        bond.setMaturityDate(LocalDate.now().minusDays(1)); // past maturity

        AssetPrice price = priceFor(bond, new BigDecimal("1100000"), new BigDecimal("1090000"));
        when(assetPriceRepository.findById(bond.getId())).thenReturn(Optional.of(price));

        boolean updated = scheduler.accreteBond(bond, LocalDate.now());

        assertFalse(updated);
        verify(assetPriceRepository, never()).save(any());
    }

    @Test
    void accreteBond_usesIssueDateWhenPresent_notCreatedAt() {
        // issueDate set explicitly (180 days ago) → used in formula, not createdAt (1h ago)
        Asset bond = activeDiscountBondAsset();
        bond.setFaceValue(new BigDecimal("1100000"));
        bond.setIssuerPrice(new BigDecimal("1000000"));
        bond.setIssueDate(LocalDate.now().minusDays(180));
        bond.setCreatedAt(Instant.now().minusSeconds(3600)); // 1 hour ago — very different
        bond.setMaturityDate(LocalDate.now().plusDays(180));

        AssetPrice price = priceFor(bond, new BigDecimal("1000000"), new BigDecimal("980000"));
        when(assetPriceRepository.findById(bond.getId())).thenReturn(Optional.of(price));

        boolean updated = scheduler.accreteBond(bond, LocalDate.now());

        assertTrue(updated);
        // ~halfway through life: price between issuerPrice and faceValue
        BigDecimal computedAsk = price.getAskPrice();
        assertTrue(computedAsk.compareTo(new BigDecimal("1000000")) > 0,
                "Should be above issuer price at midpoint");
        assertTrue(computedAsk.compareTo(new BigDecimal("1100000")) < 0,
                "Should be below face value at midpoint");
    }
}
