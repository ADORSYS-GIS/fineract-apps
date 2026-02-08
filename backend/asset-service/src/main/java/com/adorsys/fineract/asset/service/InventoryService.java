package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.InventoryResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service for tracking asset supply/inventory across all assets.
 */
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;

    /**
     * Get inventory stats for all assets.
     */
    @Transactional(readOnly = true)
    public List<InventoryResponse> getInventory() {
        List<Asset> assets = assetRepository.findAll();
        List<String> assetIds = assets.stream().map(Asset::getId).toList();
        Map<String, AssetPrice> priceMap = assetPriceRepository.findAllByAssetIdIn(assetIds)
                .stream().collect(Collectors.toMap(AssetPrice::getAssetId, Function.identity()));

        return assets.stream().map(a -> {
            AssetPrice price = priceMap.get(a.getId());
            BigDecimal currentPrice = price != null ? price.getCurrentPrice() : BigDecimal.ZERO;
            BigDecimal available = a.getTotalSupply().subtract(a.getCirculatingSupply());
            BigDecimal tvl = a.getCirculatingSupply().multiply(currentPrice);

            return new InventoryResponse(
                    a.getId(), a.getName(), a.getSymbol(), a.getStatus(),
                    a.getTotalSupply(), a.getCirculatingSupply(), available,
                    currentPrice, tvl
            );
        }).toList();
    }
}
