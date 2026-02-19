package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.dto.profile.AddressDTO;
import com.adorsys.fineract.registration.dto.profile.AddressResponseDTO;
import com.adorsys.fineract.registration.dto.profile.ProfileUpdateRequest;
import com.adorsys.fineract.registration.dto.profile.ProfileUpdateResponse;
import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.service.fineract.FineractAccountService;
import com.adorsys.fineract.registration.service.fineract.FineractAddressService;
import com.adorsys.fineract.registration.service.fineract.FineractClientService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class FineractService {

    /**
     * This service acts as a facade, providing a single, simplified entry point for all Fineract-related
     * operations within the application. It delegates the actual processing to more specialized services
     * such as FineractClientService, FineractAccountService, and FineractAddressService.
     * This design pattern decouples the rest of the application from the complexities of the individual
     * Fineract service interactions, promoting a cleaner and more maintainable architecture.
     */
    private final FineractClientService fineractClientService;
    private final FineractAccountService fineractAccountService;
    private final FineractAddressService fineractAddressService;

    public FineractService(FineractClientService fineractClientService, FineractAccountService fineractAccountService, FineractAddressService fineractAddressService) {
        this.fineractClientService = fineractClientService;
        this.fineractAccountService = fineractAccountService;
        this.fineractAddressService = fineractAddressService;
    }

    public Long createClient(RegistrationRequest request) {
        return fineractClientService.createClient(request);
    }

    public Map<String, Object> getClientByExternalId(String externalId) {
        return fineractClientService.getClientByExternalId(externalId);
    }

    public List<Map<String, Object>> getSavingsAccountsByClientId(Long clientId) {
        return fineractAccountService.getSavingsAccountsByClientId(clientId);
    }

    public Map<String, Object> getSavingsAccount(Long accountId) {
        return fineractAccountService.getSavingsAccount(accountId);
    }

    public List<Map<String, Object>> getSavingsAccountTransactions(Long accountId) {
        return fineractAccountService.getSavingsAccountTransactions(accountId);
    }

    public Long getSavingsAccountOwner(Long accountId) {
        return fineractAccountService.getSavingsAccountOwner(accountId);
    }

    public List<Map<String, Object>> getClientAddresses(Long clientId) {
        return fineractAddressService.getClientAddresses(clientId);
    }

    public ProfileUpdateResponse updateClient(Long clientId, ProfileUpdateRequest request) {
        return fineractClientService.updateClient(clientId, request);
    }

    public Long createSavingsAccount(Long clientId) {
        return fineractAccountService.createSavingsAccount(clientId);
    }

    public AddressResponseDTO createClientAddress(Long clientId, AddressDTO addressDTO) {
        return fineractAddressService.createClientAddress(clientId, addressDTO);
    }

    public AddressResponseDTO updateClientAddress(Long clientId, AddressDTO addressDTO) {
        return fineractAddressService.updateClientAddress(clientId, addressDTO);
    }
}
