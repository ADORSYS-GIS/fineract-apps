package com.adorsys.fineract.asset.exception;

public class ClientNotProvisionedException extends AssetException {

    public ClientNotProvisionedException(String externalId) {
        super("Client not provisioned in Fineract: " + externalId, "CLIENT_NOT_PROVISIONED");
    }
}
