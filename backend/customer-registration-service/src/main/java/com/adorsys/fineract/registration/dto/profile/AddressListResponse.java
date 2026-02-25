package com.adorsys.fineract.registration.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "Represents a list of customer addresses")
public class AddressListResponse {
    @Schema(description = "A list of addresses")
    private List<AddressDetailsResponse> addresses;
}
