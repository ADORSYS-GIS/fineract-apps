import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  kycApi,
  KycApprovalRequest,
  KycRejectionRequest,
  KycRequestInfoRequest,
} from "@/services/kycApi";

export const useKycStats = () => {
  return useQuery({
    queryKey: ["kyc", "stats"],
    queryFn: () => kycApi.getStats(),
    staleTime: 30000, // 30 seconds
  });
};

export const useKycSubmissions = (params: {
  status?: string;
  page?: number;
  size?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["kyc", "submissions", params],
    queryFn: () => kycApi.getSubmissions(params),
    staleTime: 30000,
  });
};

export const useKycSubmission = (externalId: string) => {
  return useQuery({
    queryKey: ["kyc", "submission", externalId],
    queryFn: () => kycApi.getSubmission(externalId),
    enabled: !!externalId,
  });
};

export const useApproveKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      externalId,
      request,
    }: {
      externalId: string;
      request: KycApprovalRequest;
    }) => kycApi.approveSubmission(externalId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },
  });
};

export const useRejectKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      externalId,
      request,
    }: {
      externalId: string;
      request: KycRejectionRequest;
    }) => kycApi.rejectSubmission(externalId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },
  });
};

export const useRequestKycInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      externalId,
      request,
    }: {
      externalId: string;
      request: KycRequestInfoRequest;
    }) => kycApi.requestInfo(externalId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },
  });
};
