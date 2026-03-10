package com.adorsys.fineract.registration.dto.profile;

import lombok.Data;
import java.util.Map;

@Data
public class ProfileUpdateResponse {
    private Long officeId;
    private Long clientId;
    private Long resourceId;
    private Map<String, Object> changes;
}
