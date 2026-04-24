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

    // ----- Round 1: 3-char base (m_currency.code is VARCHAR(3)) -----

    @Test
    void generate_fourCharSymbol_truncatesTo3() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        // "BRVM" → first 3 chars → "BRV"
        String code = generator.generate("BRVM", Collections.emptySet());

        assertEquals("BRV", code);
    }

    @Test
    void generate_symbolWithHyphen_stripsAndTruncatesTo3() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        // "BRVM-SABC" → clean "BRVMSABC" → base3 "BRV"
        String code = generator.generate("BRVM-SABC", Collections.emptySet());

        assertEquals("BRV", code);
    }

    @Test
    void generate_threeCharSymbol_returnsExact() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        String code = generator.generate("CCC", Collections.emptySet());

        assertEquals("CCC", code);
    }

    @Test
    void generate_shortSymbol_usesAvailableChars() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        // Symbol shorter than 3 chars — returned as-is
        String code = generator.generate("AB", Collections.emptySet());

        assertEquals("AB", code);
    }

    // ----- Round 2: 2-char prefix + single letter A–Z (= 3 chars) -----

    @Test
    void generate_base3Collides_fallsBackToSuffixedCandidate() {
        // "BRV" is taken; "BRA" is available
        when(assetRepository.existsByCurrencyCode("BRV")).thenReturn(true);
        when(assetRepository.existsByCurrencyCode("BRA")).thenReturn(false);

        String code = generator.generate("BRVM-SABC", Collections.emptySet());

        assertEquals("BRA", code);
    }

    @Test
    void generate_base3CollidesInFineract_fallsBackToSuffixedCandidate() {
        // "BRV" is registered in Fineract; DB has nothing
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        String code = generator.generate("BRVM-SABC", Set.of("BRV"));

        assertEquals("BRA", code);
    }

    @Test
    void generate_base3AndFirstSuffixCollide_usesNextSuffix() {
        when(assetRepository.existsByCurrencyCode("BRV")).thenReturn(true);
        when(assetRepository.existsByCurrencyCode("BRA")).thenReturn(true);
        when(assetRepository.existsByCurrencyCode("BRB")).thenReturn(false);

        String code = generator.generate("BRVMSABC", Collections.emptySet());

        assertEquals("BRB", code);
    }

    // ----- Round 3: 1-char prefix + two-letter suffix AA–ZZ (= 3 chars) -----

    @Test
    void generate_allRound2CandidatesCollide_fallsBackToOneCharBase() {
        // All round-2 candidates taken in Fineract; round-3 first hit is BAA
        Set<String> fineractCodes = new HashSet<>();
        fineractCodes.add("BRV"); // base3
        for (char c = 'A'; c <= 'Z'; c++) {
            fineractCodes.add("BR" + c); // all round-2 candidates
        }
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        String code = generator.generate("BRVM-SABC", fineractCodes);

        assertEquals("BAA", code);
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

        String code = generator.generate("brv", Collections.emptySet());

        assertEquals("BRV", code);
    }

    @Test
    void generate_numericSymbol_includesDigits() {
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        // "123" → "123" (3 chars)
        String code = generator.generate("123", Collections.emptySet());

        assertEquals("123", code);
    }

    @Test
    void generate_noCollision_doesNotQueryDbForOtherCandidates() {
        when(assetRepository.existsByCurrencyCode("BRV")).thenReturn(false);

        generator.generate("BRVM", Collections.emptySet());

        // Only the first candidate should have been checked
        verify(assetRepository, times(1)).existsByCurrencyCode(anyString());
    }

    @Test
    void generate_exhaustedNamespace_throwsAssetException() {
        // Force all candidates to be taken
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(true);

        assertThrows(AssetException.class,
                () -> generator.generate("AB", Collections.emptySet()));
    }

    @Test
    void generate_producedCodeNeverExceedsThreeChars() {
        // Verify every generated code fits m_currency.code VARCHAR(3)
        when(assetRepository.existsByCurrencyCode(anyString())).thenReturn(false);

        for (String symbol : new String[]{"A", "AB", "ABC", "ABCD", "ABCDE", "AB-CD", "BRVM", "TEST"}) {
            String code = generator.generate(symbol, Collections.emptySet());
            assertTrue(code.length() <= 3,
                    "Expected code length <= 3 for symbol '" + symbol + "' but got '" + code + "'");
        }
    }
}
