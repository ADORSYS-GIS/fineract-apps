package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.InventoryResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
     * Get inventory stats for all assets, paginated.
     */
    @Transactional(readOnly = true)
    public Page<InventoryResponse> getInventory(Pageable pageable) {
        Sort stable = pageable.getSort().and(Sort.by("id"));
        Pageable stablePageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), stable);
        Page<Asset> assets = assetRepository.findAll(stablePageable);
        List<String> assetIds = assets.getContent().stream().map(Asset::getId).toList();
        Map<String, AssetPrice> priceMap = assetPriceRepository.findAllByAssetIdIn(assetIds)
                .stream().collect(Collectors.toMap(AssetPrice::getAssetId, Function.identity()));

        return assets.map(a -> {
            AssetPrice price = priceMap.get(a.getId());
            BigDecimal currentPrice = price != null ? price.getCurrentPrice() : BigDecimal.ZERO;
            BigDecimal available = a.getTotalSupply().subtract(a.getCirculatingSupply());
            BigDecimal tvl = a.getCirculatingSupply().multiply(currentPrice);

            return new InventoryResponse(
                    a.getId(), a.getName(), a.getSymbol(), a.getStatus(),
                    a.getTotalSupply(), a.getCirculatingSupply(), available,
                    currentPrice, tvl
            );
        });
    }
}
