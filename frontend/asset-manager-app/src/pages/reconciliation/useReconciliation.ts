import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { assetApi, extractErrorMessage } from "@/services/assetApi";

export const useReconciliation = () => {
	const queryClient = useQueryClient();
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [severityFilter, setSeverityFilter] = useState<string>("");
	const [page, setPage] = useState(0);

	const {
		data: reportsData,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["reconciliation-reports", statusFilter, severityFilter, page],
		queryFn: () =>
			assetApi.getReconciliationReports({
				page,
				size: 20,
				status: statusFilter || undefined,
				severity: severityFilter || undefined,
			}),
		select: (res) => res.data,
	});

	const { data: summary } = useQuery({
		queryKey: ["reconciliation-summary"],
		queryFn: () => assetApi.getReconciliationSummary(),
		select: (res) => res.data,
	});

	const triggerMutation = useMutation({
		mutationFn: () => assetApi.triggerReconciliation(),
		onSuccess: (res) => {
			toast.success(
				`Reconciliation complete: ${res.data.discrepancies} discrepancies found`,
			);
			queryClient.invalidateQueries({
				queryKey: ["reconciliation-reports"],
			});
			queryClient.invalidateQueries({
				queryKey: ["reconciliation-summary"],
			});
		},
		onError: (err: unknown) => toast.error(extractErrorMessage(err)),
	});

	const acknowledgeMutation = useMutation({
		mutationFn: (id: number) => assetApi.acknowledgeReport(id),
		onSuccess: () => {
			toast.success("Report acknowledged");
			queryClient.invalidateQueries({
				queryKey: ["reconciliation-reports"],
			});
			queryClient.invalidateQueries({
				queryKey: ["reconciliation-summary"],
			});
		},
		onError: (err: unknown) => toast.error(extractErrorMessage(err)),
	});

	const resolveMutation = useMutation({
		mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
			assetApi.resolveReport(id, undefined, notes),
		onSuccess: () => {
			toast.success("Report resolved");
			queryClient.invalidateQueries({
				queryKey: ["reconciliation-reports"],
			});
			queryClient.invalidateQueries({
				queryKey: ["reconciliation-summary"],
			});
		},
		onError: (err: unknown) => toast.error(extractErrorMessage(err)),
	});

	return {
		reports: reportsData?.content ?? [],
		totalPages: reportsData?.totalPages ?? 0,
		totalElements: reportsData?.totalElements ?? 0,
		openReports: summary?.openReports ?? 0,
		isLoading,
		isError,
		refetch,
		page,
		setPage,
		statusFilter,
		setStatusFilter,
		severityFilter,
		setSeverityFilter,
		triggerReconciliation: () => triggerMutation.mutate(),
		isTriggering: triggerMutation.isPending,
		acknowledgeReport: (id: number) => acknowledgeMutation.mutate(id),
		isAcknowledging: acknowledgeMutation.isPending,
		resolveReport: (id: number, notes?: string) =>
			resolveMutation.mutate({ id, notes }),
		isResolving: resolveMutation.isPending,
	};
};
