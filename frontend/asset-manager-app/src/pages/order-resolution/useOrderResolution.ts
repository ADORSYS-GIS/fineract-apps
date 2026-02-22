import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	type AdminOrder,
	type AssetOption,
	assetApi,
	extractErrorMessage,
	type OrderDetail,
	type OrderSummary,
} from "@/services/assetApi";

export const useOrderResolution = () => {
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 20;

	// Filter state
	const [statusFilter, setStatusFilter] = useState("");
	const [assetFilter, setAssetFilter] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");

	// Detail panel state
	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
		return () => clearTimeout(timer);
	}, [searchInput]);

	// Reset page when filters change
	const resetPage = useCallback(() => setCurrentPage(1), []);
	useEffect(() => {
		resetPage();
	}, [statusFilter, assetFilter, debouncedSearch, fromDate, toDate, resetPage]);

	// Build query params
	const queryParams = {
		page: currentPage - 1,
		size: pageSize,
		...(statusFilter && { status: statusFilter }),
		...(assetFilter && { assetId: assetFilter }),
		...(debouncedSearch && { search: debouncedSearch }),
		...(fromDate && { fromDate: new Date(fromDate).toISOString() }),
		...(toDate && { toDate: new Date(toDate).toISOString() }),
	};

	const {
		data: ordersData,
		isLoading: ordersLoading,
		isError: ordersError,
		refetch: refetchOrders,
	} = useQuery({
		queryKey: ["admin-orders", queryParams],
		queryFn: () => assetApi.getAdminOrders(queryParams),
		select: (res) => res.data,
	});

	const {
		data: summary,
		isLoading: summaryLoading,
		refetch: refetchSummary,
	} = useQuery({
		queryKey: ["admin-orders-summary"],
		queryFn: () => assetApi.getOrderSummary(),
		select: (res) => res.data,
	});

	const { data: assetOptions } = useQuery({
		queryKey: ["admin-orders-asset-options"],
		queryFn: () => assetApi.getOrderAssetOptions(),
		select: (res) => res.data,
	});

	const { data: orderDetail, isLoading: detailLoading } = useQuery({
		queryKey: ["admin-order-detail", selectedOrderId],
		queryFn: () => assetApi.getOrderDetail(selectedOrderId!),
		select: (res) => res.data,
		enabled: !!selectedOrderId,
	});

	const { data: adminAlertCount } = useQuery({
		queryKey: ["admin-unread-count"],
		queryFn: () => assetApi.getAdminUnreadCount(),
		select: (res) => res.data.unreadCount,
	});

	const resolveMutation = useMutation({
		mutationFn: ({
			orderId,
			resolution,
		}: {
			orderId: string;
			resolution: string;
		}) => assetApi.resolveOrder(orderId, { resolution }),
		onSuccess: () => {
			toast.success("Order resolved successfully");
			queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
			queryClient.invalidateQueries({ queryKey: ["admin-orders-summary"] });
			queryClient.invalidateQueries({ queryKey: ["admin-order-detail"] });
			setSelectedOrderId(null);
		},
		onError: (error) => {
			toast.error(extractErrorMessage(error));
		},
	});

	const orders: AdminOrder[] = ordersData?.content ?? [];
	const totalPages = ordersData?.totalPages ?? 1;
	const orderSummary: OrderSummary = summary ?? {
		needsReconciliation: 0,
		failed: 0,
		manuallyClosed: 0,
	};

	return {
		orders,
		orderSummary,
		isLoading: ordersLoading || summaryLoading,
		isError: ordersError,
		refetch: () => {
			refetchOrders();
			refetchSummary();
		},
		currentPage,
		totalPages,
		onPageChange: setCurrentPage,
		resolveOrder: resolveMutation.mutate,
		isResolving: resolveMutation.isPending,
		// Filters
		statusFilter,
		setStatusFilter,
		assetFilter,
		setAssetFilter,
		searchInput,
		setSearchInput,
		fromDate,
		setFromDate,
		toDate,
		setToDate,
		assetOptions: (assetOptions ?? []) as AssetOption[],
		// Detail
		selectedOrderId,
		setSelectedOrderId,
		orderDetail: orderDetail as OrderDetail | undefined,
		detailLoading,
		// Admin alerts
		adminAlertCount: adminAlertCount ?? 0,
	};
};
