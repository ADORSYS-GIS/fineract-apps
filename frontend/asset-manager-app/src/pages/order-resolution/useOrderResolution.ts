import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
	type AdminOrder,
	assetApi,
	extractErrorMessage,
	type OrderSummary,
} from "@/services/assetApi";

export const useOrderResolution = () => {
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 20;

	const {
		data: ordersData,
		isLoading: ordersLoading,
		isError: ordersError,
		refetch: refetchOrders,
	} = useQuery({
		queryKey: ["admin-orders", currentPage],
		queryFn: () =>
			assetApi.getAdminOrders({ page: currentPage - 1, size: pageSize }),
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
			queryClient.invalidateQueries({
				queryKey: ["admin-orders-summary"],
			});
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
	};
};
