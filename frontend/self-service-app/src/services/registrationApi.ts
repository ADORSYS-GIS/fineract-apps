import { API_CONFIG, apiFetch, createRegistrationHeaders } from "./api";

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

export interface RegistrationResponse {
  success: boolean;
  externalId: string;
  message: string;
  fineractClientId?: number;
  keycloakUserId?: string;
}

export interface RegistrationStatusResponse {
  externalId: string;
  status: "pending" | "active" | "failed";
  fineractClientId?: number;
  keycloakUserId?: string;
  createdAt: string;
  activatedAt?: string;
  errorMessage?: string;
}

export interface KycUploadRequest {
  documentType: string;
  file: File;
  externalId: string;
}

export interface KycStatusResponse {
  tier: number;
  status: "pending" | "under_review" | "approved" | "rejected";
  documents: {
    type: string;
    status: string;
    uploadedAt?: string;
    rejectionReason?: string;
  }[];
}

export interface LimitsResponse {
  tier: number;
  deposit: {
    daily: number;
    perTransaction: number;
    monthly: number;
    remaining: {
      daily: number;
      monthly: number;
    };
  };
  withdrawal: {
    daily: number;
    perTransaction: number;
    monthly: number;
    remaining: {
      daily: number;
      monthly: number;
    };
  };
  paymentMethods: {
    id: string;
    name: string;
    enabled: boolean;
    minAmount: number;
    maxAmount: number;
    requiresKycTier: number;
  }[];
}

/**
 * Registration API client
 */
export const registrationApi = {
  /**
   * Register a new customer
   */
  async register(data: RegistrationRequest): Promise<RegistrationResponse> {
    return apiFetch<RegistrationResponse>(
      `${API_CONFIG.registration.baseUrl}/registration/register`,
      {
        method: "POST",
        headers: createRegistrationHeaders(),
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Get registration status by external ID
   */
  async getStatus(
    externalId: string,
    accessToken: string
  ): Promise<RegistrationStatusResponse> {
    return apiFetch<RegistrationStatusResponse>(
      `${API_CONFIG.registration.baseUrl}/registration/status/${externalId}`,
      {
        headers: createRegistrationHeaders(accessToken),
      }
    );
  },

  /**
   * Upload KYC document
   */
  async uploadKycDocument(
    data: KycUploadRequest,
    accessToken: string
  ): Promise<{ success: boolean; documentId: string }> {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("documentType", data.documentType);
    formData.append("externalId", data.externalId);

    const response = await fetch(
      `${API_CONFIG.registration.baseUrl}/registration/kyc/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to upload document");
    }

    return response.json();
  },

  /**
   * Get KYC status
   */
  async getKycStatus(
    externalId: string,
    accessToken: string
  ): Promise<KycStatusResponse> {
    return apiFetch<KycStatusResponse>(
      `${API_CONFIG.registration.baseUrl}/registration/kyc/status?externalId=${externalId}`,
      {
        headers: createRegistrationHeaders(accessToken),
      }
    );
  },

  /**
   * Get transaction limits
   */
  async getLimits(
    externalId: string,
    accessToken: string
  ): Promise<LimitsResponse> {
    return apiFetch<LimitsResponse>(
      `${API_CONFIG.registration.baseUrl}/registration/limits?externalId=${externalId}`,
      {
        headers: createRegistrationHeaders(accessToken),
      }
    );
  },
};
