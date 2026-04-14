package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CurrencyCodeGeneratorTest {

    @Mock
    private AssetRepository assetRepository;

    @InjectMocks
    private CurrencyCodeGenerator generator;

    // ----- Round 1: 4-char base -----

    @Test
    void generate_shortSymbol_returnsFourCharBase() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        String code = generator.generate("BRVM", Collections.emptySet());

        assertEquals("BRVM", code);
    }

    @Test
    void generate_symbolWithHyphen_stripsAndTruncatesTo4() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        // "BRVM-SABC" → clean "BRVMSABC" → base4 "BRVM"
        String code = generator.generate("BRVM-SABC", Collections.emptySet());

        assertEquals("BRVM", code);
    }

    @Test
    void generate_shortSymbol_usesAvailableChars() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        // Symbol shorter than 4 chars
        String code = generator.generate("AB", Collections.emptySet());

        assertEquals("AB", code);
    }

    // ----- Round 2: 3-char + suffix A–Z -----

    @Test
    void generate_base4Collides_fallsBackToSuffixedCandidate() {
        // "BRVM" is taken; "BRVA" is available
        when(assetRepository.existsByCurrencyCode("BRVM")).thenReturn(true);
        when(assetRepository.existsByCurrencyCode("BRVA")).thenReturn(false);

        String code = generator.generate("BRVM-SABC", Collections.emptySet());

        assertEquals("BRVA", code);
    }

    @Test
    void generate_base4CollidesInFineract_fallsBackToSuffixedCandidate() {
        // "BRVM" is registered in Fineract; DB has nothing
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        String code = generator.generate("BRVM-SABC", Set.of("BRVM"));

        assertEquals("BRVA", code);
    }

    @Test
    void generate_base4AndFirstSuffixCollide_usesNextSuffix() {
        when(assetRepository.existsByCurrencyCode("BRVM")).thenReturn(true);
        when(assetRepository.existsByCurrencyCode("BRVA")).thenReturn(true);
        when(assetRepository.existsByCurrencyCode("BRVB")).thenReturn(false);

        String code = generator.generate("BRVMSABC", Collections.emptySet());

        assertEquals("BRVB", code);
    }

    // ----- Round 3: 2-char + two-letter suffix AA–ZZ -----

    @Test
    void generate_allSuffixedCandidatesCollide_fallsBackToTwoCharBase() {
        // All round-2 candidates taken in Fineract; round-3 first hit is BRAA
        Set<String> fineractCodes = new HashSet<>();
        fineractCodes.add("BRVM"); // base4
        for (char c = 'A'; c <= 'Z'; c++) {
            fineractCodes.add("BRV" + c); // all round-2 candidates
        }
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        String code = generator.generate("BRVM-SABC", fineractCodes);

        assertEquals("BRAA", code);
    }

    // ----- Edge cases -----

    @Test
    void generate_symbolWithOnlySpecialChars_usesFallback() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        // Symbol "---" → clean "" → fallback "AST"
        String code = generator.generate("---", Collections.emptySet());

        assertEquals("AST", code);
    }

    @Test
    void generate_lowercaseSymbol_normalisedToUppercase() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        String code = generator.generate("brvm", Collections.emptySet());

        assertEquals("BRVM", code);
    }

    @Test
    void generate_numericSymbol_includesDigits() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        String code = generator.generate("1234", Collections.emptySet());

        assertEquals("1234", code);
    }

    @Test
    void generate_noCollision_doesNotQueryDbForOtherCandidates() {
        when(assetRepository.existsByCurrencyCode("BRVM")).thenReturn(false);

        generator.generate("BRVM", Collections.emptySet());

        // Only the first candidate should have been checked
        verify(assetRepository, times(1)).existsByCurrencyCode(anyString());
    }

    @Test
    void generate_exhaustedNamespace_throwsAssetException() {
        // Force all 702 candidates to be taken by always returning true from DB
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(true);

        assertThrows(AssetException.class,
                () -> generator.generate("AB", Collections.emptySet()));
    }
}
