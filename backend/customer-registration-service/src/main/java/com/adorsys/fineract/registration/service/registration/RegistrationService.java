package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.dto.registration.RegistrationResponse;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import io.micrometer.core.annotation.Timed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final com.adorsys.fineract.registration.service.FineractService fineractService;
    private final RegistrationMetrics registrationMetrics;

    @Timed(value = "registration.service.register", description = "Time taken to register a new customer")
    @PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")
        public RegistrationResponse register(RegistrationRequest request) {
        log.info("Starting registration process for email: {}", request.getEmail());
        registrationMetrics.incrementRegistrationRequests();

        String externalId = request.getExternalId();
        log.info("Using externalId: {}", externalId);

        Long fineractClientId = fineractService.createClient(request, externalId);
        log.info("Successfully created client in Fineract with ID: {}", fineractClientId);

        RegistrationResponse response = new RegistrationResponse();
        response.setSuccess(true);
        response.setStatus("success");
        response.setFineractClientId(fineractClientId);

        log.info("Registration process completed successfully for externalId: {}", externalId);
        registrationMetrics.incrementRegistrationSuccess();

        return response;
    }
}
