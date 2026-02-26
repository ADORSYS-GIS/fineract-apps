import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	assetApi,
	extractErrorMessage,
	type ScheduledPaymentDetailResponse,
	type ScheduledPaymentResponse,
	type ScheduledPaymentSummary,
} from "@/services/assetApi";

export const useScheduledPayments = () => {
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 20;

	// Filter state
	const [statusFilter, setStatusFilter] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [assetFilter, setAssetFilter] = useState("");

	// Modal state
	const [confirmModal, setConfirmModal] = useState<{
		schedule: ScheduledPaymentResponse;
		amountPerUnit: string;
	} | null>(null);
	const [cancelModal, setCancelModal] = useState<{
		schedule: ScheduledPaymentResponse;
		reason: string;
	} | null>(null);
	const [detailId, setDetailId] = useState<number | null>(null);

	// Reset page when filters change
	const resetPage = useCallback(() => setCurrentPage(1), []);
	useEffect(() => {
		resetPage();
	}, [statusFilter, typeFilter, assetFilter, resetPage]);

	// Build query params
	const queryParams = {
		page: currentPage - 1,
		size: pageSize,
		...(statusFilter && { status: statusFilter }),
		...(assetFilter && { assetId: assetFilter }),
		...(typeFilter && { type: typeFilter }),
	};

	const {
		data: schedulesData,
		isLoading: schedulesLoading,
		isError: schedulesError,
		refetch: refetchSchedules,
	} = useQuery({
		queryKey: ["scheduled-payments", queryParams],
		queryFn: () => assetApi.getScheduledPayments(queryParams),
		select: (res) => res.data,
	});

	const {
		data: summary,
		isLoading: summaryLoading,
		refetch: refetchSummary,
	} = useQuery({
		queryKey: ["scheduled-payments-summary"],
		queryFn: () => assetApi.getScheduledPaymentSummary(),
		select: (res) => res.data,
	});

	const { data: allAssets } = useQuery({
		queryKey: ["admin-assets-list"],
		queryFn: () => assetApi.listAllAssets({ size: 100 }),
		select: (res) =>
			res.data.content.map((a) => ({
				id: a.id,
				symbol: a.symbol,
				name: a.name,
			})),
	});

	const { data: detail, isLoading: detailLoading } = useQuery({
		queryKey: ["scheduled-payment-detail", detailId],
		queryFn: () => assetApi.getScheduledPaymentDetail(detailId!),
		select: (res) => res.data,
		enabled: !!detailId,
	});

	const invalidateAll = () => {
		queryClient.invalidateQueries({ queryKey: ["scheduled-payments"] });
		queryClient.invalidateQueries({
			queryKey: ["scheduled-payments-summary"],
		});
		queryClient.invalidateQueries({
			queryKey: ["scheduled-payment-detail"],
		});
	};

	const confirmMutation = useMutation({
		mutationFn: ({
			id,
			amountPerUnit,
		}: {
			id: number;
			amountPerUnit?: number;
		}) =>
			assetApi.confirmScheduledPayment(
				id,
				amountPerUnit ? { amountPerUnit } : undefined,
			),
		onSuccess: (res) => {
			const d = res.data;
			toast.success(
				`Payment confirmed: ${d.holdersPaid} paid, ${d.holdersFailed} failed`,
			);
			invalidateAll();
			setConfirmModal(null);
			setDetailId(null);
		},
		onError: (error) => {
			toast.error(extractErrorMessage(error));
		},
	});

	const cancelMutation = useMutation({
		mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
			assetApi.cancelScheduledPayment(id, reason ? { reason } : undefined),
		onSuccess: () => {
			toast.success("Payment cancelled");
			invalidateAll();
			setCancelModal(null);
			setDetailId(null);
		},
		onError: (error) => {
			toast.error(extractErrorMessage(error));
		},
	});

	const schedules: ScheduledPaymentResponse[] = schedulesData?.content ?? [];
	const totalPages = schedulesData?.totalPages ?? 1;
	const paymentSummary: ScheduledPaymentSummary = summary ?? {
		pendingCount: 0,
		confirmedThisMonth: 0,
		totalPaidThisMonth: 0,
	};

	return {
		schedules,
		paymentSummary,
		isLoading: schedulesLoading || summaryLoading,
		isError: schedulesError,
		refetch: () => {
			refetchSchedules();
			refetchSummary();
		},
		currentPage,
		totalPages,
		onPageChange: setCurrentPage,
		// Filters
		statusFilter,
		setStatusFilter,
		typeFilter,
		setTypeFilter,
		assetFilter,
		setAssetFilter,
		assetOptions: allAssets ?? [],
		// Confirm
		confirmModal,
		openConfirmModal: (schedule: ScheduledPaymentResponse) =>
			setConfirmModal({
				schedule,
				amountPerUnit: String(schedule.estimatedAmountPerUnit ?? ""),
			}),
		closeConfirmModal: () => setConfirmModal(null),
		setConfirmAmount: (val: string) =>
			confirmModal && setConfirmModal({ ...confirmModal, amountPerUnit: val }),
		confirmPayment: () => {
			if (!confirmModal) return;
			const amt =
				confirmModal.schedule.paymentType === "INCOME" &&
				confirmModal.amountPerUnit
					? Number(confirmModal.amountPerUnit)
					: undefined;
			confirmMutation.mutate({
				id: confirmModal.schedule.id,
				amountPerUnit: amt,
			});
		},
		isConfirming: confirmMutation.isPending,
		// Cancel
		cancelModal,
		openCancelModal: (schedule: ScheduledPaymentResponse) =>
			setCancelModal({ schedule, reason: "" }),
		closeCancelModal: () => setCancelModal(null),
		setCancelReason: (val: string) =>
			cancelModal && setCancelModal({ ...cancelModal, reason: val }),
		cancelPayment: () => {
			if (!cancelModal) return;
			cancelMutation.mutate({
				id: cancelModal.schedule.id,
				reason: cancelModal.reason || undefined,
			});
		},
		isCancelling: cancelMutation.isPending,
		// Detail
		detailId,
		setDetailId,
		detail: detail as ScheduledPaymentDetailResponse | undefined,
		detailLoading,
	};
};
