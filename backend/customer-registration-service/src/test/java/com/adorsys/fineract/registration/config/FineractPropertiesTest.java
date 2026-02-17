package com.adorsys.fineract.registration.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class FineractPropertiesTest {

    @Autowired
    private FineractProperties fineractProperties;

    @Test
    void fineractPropertiesAreLoaded() {
        assertEquals(1, fineractProperties.getDefaultOfficeId());
        assertEquals(1, fineractProperties.getDefaultSavingsProductId());
        assertEquals(1, fineractProperties.getDefaultLegalFormId());
        assertEquals("en", fineractProperties.getDefaultLocale());
        assertEquals("dd MMMM yyyy", fineractProperties.getDefaultDateFormat());

        Map<String, Integer> codes = fineractProperties.getCodes();
        assertNotNull(codes);
        assertEquals(29, codes.get("ADDRESS_TYPE"));
        assertEquals(28, codes.get("COUNTRY"));
        assertEquals(27, codes.get("STATE"));
        assertEquals(4, codes.get("Gender"));
    }
}
