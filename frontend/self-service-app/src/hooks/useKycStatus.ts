import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

export interface KycStatus {
  tier: number;
  status: "pending" | "under_review" | "approved" | "rejected";
  documents: {
    type: string;
    status: "pending" | "uploaded" | "verified" | "rejected";
    uploadedAt?: string;
    rejectionReason?: string;
  }[];
  limits: {
    daily: number;
    perTransaction: number;
    monthly: number;
  };
}

async function fetchKycStatus(
  externalId: string,
  accessToken: string
): Promise<KycStatus> {
  const response = await fetch(
    `${import.meta.env.VITE_REGISTRATION_API_URL || "/api"}/registration/kyc/status?externalId=${externalId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch KYC status");
  }

  return response.json();
}

export function useKycStatus() {
  const auth = useAuth();
  const externalId = auth.user?.profile?.fineract_external_id as string | undefined;

  // Also get KYC info from token claims as fallback
  const tokenKycTier = auth.user?.profile?.kyc_tier as number | undefined;
  const tokenKycStatus = auth.user?.profile?.kyc_status as string | undefined;

  const query = useQuery({
    queryKey: ["kycStatus", externalId],
    queryFn: () => {
      if (!externalId || !auth.user?.access_token) {
        throw new Error("Not authenticated");
      }
      return fetchKycStatus(externalId, auth.user.access_token);
    },
    enabled: !!externalId && !!auth.user?.access_token,
    staleTime: 60 * 1000, // 1 minute
    // Return token-based data if API fails
    placeholderData: {
      tier: tokenKycTier || 1,
      status: (tokenKycStatus as KycStatus["status"]) || "pending",
      documents: [],
      limits: {
        daily: tokenKycTier === 2 ? 500000 : 50000,
        perTransaction: tokenKycTier === 2 ? 200000 : 25000,
        monthly: tokenKycTier === 2 ? 2000000 : 150000,
      },
    },
  });

  return {
    ...query,
    // Provide convenience getters from token if API data not available
    tier: query.data?.tier || tokenKycTier || 1,
    status: query.data?.status || tokenKycStatus || "pending",
    limits: query.data?.limits || {
      daily: (tokenKycTier || 1) === 2 ? 500000 : 50000,
      perTransaction: (tokenKycTier || 1) === 2 ? 200000 : 25000,
      monthly: (tokenKycTier || 1) === 2 ? 2000000 : 150000,
    },
  };
}
