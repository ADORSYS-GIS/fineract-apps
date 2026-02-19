package com.adorsys.fineract.registration.dto.profile;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String mobileNo;
    private String emailAddress;
}
