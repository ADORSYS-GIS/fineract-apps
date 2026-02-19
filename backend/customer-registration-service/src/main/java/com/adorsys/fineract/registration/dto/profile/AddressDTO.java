package com.adorsys.fineract.registration.dto.profile;

import lombok.Data;

@Data
public class AddressDTO {
    private Long addressId;
    private String street;
    private String addressLine1;
    private String addressLine2;
    private String addressLine3;
    private String city;
    private String stateProvince;
    private String country;
    private String postalCode;
    private String addressType;
}
