package com.adorsys.fineract.registration.dto.registration;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for the {@code POST /api/registration/check-phone} endpoint.
 *
 * <p>POST + JSON body is used (rather than a query string) so the literal {@code +}
 * in E.164-style phone numbers survives transit. Spring's {@code @RequestParam} on a
 * raw GET query decodes {@code +} to space (HTML form-encoding semantics), which would
 * make every E.164 lookup fail.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckPhoneRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?\\d{9,15}$", message = "Invalid phone number format")
    @Size(max = 16)
    @Schema(example = "+237699555444", description = "E.164-style phone number; same regex as RegistrationRequest.phone.")
    private String phone;
}
