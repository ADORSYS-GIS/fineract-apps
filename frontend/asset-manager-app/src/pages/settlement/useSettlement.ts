import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { assetApi } from "@/services/assetApi";

export const useSettlement = () => {
	const queryClient = useQueryClient();
	const [statusFilter, setStatusFilter] = useState<string>("ALL");
	const [showCreateForm, setShowCreateForm] = useState(false);

	const {
		data: settlements,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["settlements", statusFilter],
		queryFn: () =>
			assetApi.getSettlements(
				statusFilter !== "ALL" ? [statusFilter] : undefined,
			),
		select: (res) => res.data,
	});

	const { data: summary } = useQuery({
		queryKey: ["settlement-summary"],
		queryFn: () => assetApi.getSettlementSummary(),
		select: (res) => res.data,
	});

	const { data: lpBalances } = useQuery({
		queryKey: ["lp-balances"],
		queryFn: () => assetApi.getLpBalances(),
		select: (res) => res.data,
	});

	const { data: trustBalances } = useQuery({
		queryKey: ["trust-balances"],
		queryFn: () => assetApi.getTrustBalances(),
		select: (res) => res.data,
	});

	const approveMutation = useMutation({
		mutationFn: (id: string) => assetApi.approveSettlement(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settlements"] });
			queryClient.invalidateQueries({ queryKey: ["settlement-summary"] });
		},
	});

	const executeMutation = useMutation({
		mutationFn: (id: string) => assetApi.executeSettlement(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settlements"] });
			queryClient.invalidateQueries({ queryKey: ["settlement-summary"] });
		},
	});

	const rejectMutation = useMutation({
		mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
			assetApi.rejectSettlement(id, reason),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settlements"] });
			queryClient.invalidateQueries({ queryKey: ["settlement-summary"] });
		},
	});

	const createMutation = useMutation({
		mutationFn: (data: {
			settlementType: string;
			amount: number;
			lpClientId?: number;
			description?: string;
			sourceGlCode?: string;
			destinationGlCode?: string;
		}) => assetApi.createSettlement(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settlements"] });
			queryClient.invalidateQueries({ queryKey: ["settlement-summary"] });
			setShowCreateForm(false);
		},
	});

	return {
		settlements,
		summary,
		lpBalances,
		trustBalances,
		isLoading,
		isError,
		refetch,
		statusFilter,
		setStatusFilter,
		showCreateForm,
		setShowCreateForm,
		approveMutation,
		executeMutation,
		rejectMutation,
		createMutation,
	};
};
