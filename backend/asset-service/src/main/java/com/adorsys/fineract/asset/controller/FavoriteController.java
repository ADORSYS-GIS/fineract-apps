package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.FavoriteResponse;
import com.adorsys.fineract.asset.service.FavoriteService;
import com.adorsys.fineract.asset.util.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Authenticated endpoints for user favorites/watchlist.
 */
@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorites", description = "Manage user watchlist")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    @Operation(summary = "Get user's watchlist")
    public ResponseEntity<List<FavoriteResponse>> getFavorites(@AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        return ResponseEntity.ok(favoriteService.getFavorites(userId));
    }

    @PostMapping("/{assetId}")
    @Operation(summary = "Add to watchlist")
    public ResponseEntity<Void> addFavorite(@PathVariable String assetId, @AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        favoriteService.addFavorite(userId, assetId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{assetId}")
    @Operation(summary = "Remove from watchlist")
    public ResponseEntity<Void> removeFavorite(@PathVariable String assetId, @AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        favoriteService.removeFavorite(userId, assetId);
        return ResponseEntity.noContent().build();
    }
}
