package com.adorsys.fineract.registration.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Represents a single address of a customer")
public class AddressDetailsResponse {
    @Schema(description = "The type of address (e.g., Residential, Business)", example = "Residential")
    private String addressType;
    @Schema(description = "The primary address line", example = "Rue Drouot")
    private String addressLine1;
    @Schema(description = "The second address line, can be used for latitude", example = "4.1585")
    private String addressLine2;
    @Schema(description = "The third address line, can be used for longitude", example = "9.2435")
    private String addressLine3;
    @Schema(description = "The city of the address", example = "Douala")
    private String city;
    @Schema(description = "The state or province of the address", example = "Littoral")
    private String stateProvince;
    @Schema(description = "The country of the address", example = "Cameroon")
    private String country;
    @Schema(description = "The postal code of the address", example = "00237")
    private String postalCode;
}
