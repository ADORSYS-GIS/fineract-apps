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
        assertEquals(1, fineractProperties.getDefaults().getOfficeId());
        assertEquals(1, fineractProperties.getDefaults().getSavingsProductId());
        assertEquals(1, fineractProperties.getDefaults().getLegalFormId());
        assertEquals("en", fineractProperties.getDefaults().getLocale());
        assertEquals("dd MMMM yyyy", fineractProperties.getDefaults().getDateFormat());

        Map<String, Integer> codes = fineractProperties.getCodes();
        assertNotNull(codes);
        assertEquals(29, codes.get("ADDRESS_TYPE"));
        assertEquals(28, codes.get("COUNTRY"));
        assertEquals(27, codes.get("STATE"));
        assertEquals(4, codes.get("Gender"));
    }
}
