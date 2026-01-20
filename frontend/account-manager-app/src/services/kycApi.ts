const KYC_API_BASE = import.meta.env.VITE_REGISTRATION_API_URL || '/api/registration';

export interface KycStats {
  pendingCount: number;
  approvedToday: number;
  rejectedToday: number;
  avgReviewTimeMinutes: number;
}

export interface KycSubmissionSummary {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  kycTier: number;
  kycStatus: string;
  submittedAt: string;
}

export interface KycDocument {
  id: string;
  type: string;
  fileName: string;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

export interface KycSubmissionDetail {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationality: string;
  kycTier: number;
  kycStatus: string;
  documents: KycDocument[];
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  reviewNotes: string | null;
}

export interface KycSubmissionsResponse {
  content: KycSubmissionSummary[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface KycApprovalRequest {
  newTier: number;
  notes?: string;
}

export interface KycRejectionRequest {
  reason: string;
  notes?: string;
}

export interface KycRequestInfoRequest {
  message: string;
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response;
}

export const kycApi = {
  getStats: async (): Promise<KycStats> => {
    const response = await fetchWithAuth(`${KYC_API_BASE}/kyc/staff/stats`);
    return response.json();
  },

  getSubmissions: async (params: {
    status?: string;
    page?: number;
    size?: number;
    search?: string;
  }): Promise<KycSubmissionsResponse> => {
    const searchParams = new URLSearchParams();
    if (params.status && params.status !== 'all') {
      searchParams.set('status', params.status);
    }
    if (params.page !== undefined) {
      searchParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      searchParams.set('size', params.size.toString());
    }
    if (params.search) {
      searchParams.set('search', params.search);
    }

    const response = await fetchWithAuth(
      `${KYC_API_BASE}/kyc/staff/submissions?${searchParams.toString()}`
    );
    return response.json();
  },

  getSubmission: async (externalId: string): Promise<KycSubmissionDetail> => {
    const response = await fetchWithAuth(
      `${KYC_API_BASE}/kyc/staff/submissions/${externalId}`
    );
    return response.json();
  },

  approveSubmission: async (
    externalId: string,
    request: KycApprovalRequest
  ): Promise<void> => {
    await fetchWithAuth(
      `${KYC_API_BASE}/kyc/staff/submissions/${externalId}/approve`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  rejectSubmission: async (
    externalId: string,
    request: KycRejectionRequest
  ): Promise<void> => {
    await fetchWithAuth(
      `${KYC_API_BASE}/kyc/staff/submissions/${externalId}/reject`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  requestInfo: async (
    externalId: string,
    request: KycRequestInfoRequest
  ): Promise<void> => {
    await fetchWithAuth(
      `${KYC_API_BASE}/kyc/staff/submissions/${externalId}/request-info`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },
};
