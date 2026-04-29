package com.adorsys.fineract.registration.dto.registration;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response payload for the {@code POST /api/registration/check-phone} endpoint.
 *
 * <p>Surfaces whether the supplied phone number is already linked to a Fineract client,
 * so upstream callers (e.g. the keybound-backend phone OTP flow) can short-circuit a
 * registration attempt before the user has done legal acceptance and admin review.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CheckPhoneResponse {
    /** True when a Fineract client is already registered against the supplied phone. */
    private boolean exists;

    /** The {@code externalId} of the existing client when {@link #exists} is true; otherwise null. */
    @Schema(nullable = true, description = "Set only when exists is true; the externalId of the existing client.")
    private String externalId;
}
