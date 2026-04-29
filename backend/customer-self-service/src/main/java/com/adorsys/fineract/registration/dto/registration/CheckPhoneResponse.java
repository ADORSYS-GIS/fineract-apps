package com.adorsys.fineract.registration.dto.registration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response payload for the {@code GET /api/registration/check-phone} endpoint.
 *
 * <p>Surfaces whether the supplied phone number is already linked to a Fineract client,
 * so upstream callers (e.g. the keybound-backend phone OTP flow) can short-circuit a
 * registration attempt before the user has done legal acceptance and admin review.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckPhoneResponse {
    /** True when a Fineract client is already registered against the supplied phone. */
    private boolean exists;

    /** The {@code externalId} of the existing client when {@link #exists} is true; otherwise null. */
    private String externalId;
}
