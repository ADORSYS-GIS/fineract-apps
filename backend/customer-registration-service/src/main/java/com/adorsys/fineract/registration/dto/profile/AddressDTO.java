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
    private Integer stateProvinceId;
    private Integer countryId;
    private String postalCode;
}
