import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import {
	assetApi,
	type MarketMakerOrder,
	type MarketMakerOrderRequest,
} from "@/services/assetApi";

export const useOrderBook = () => {
	const { assetId } = useParams({ from: "/order-book/$assetId" });
	const queryClient = useQueryClient();
	const [editingOrder, setEditingOrder] = useState<MarketMakerOrder | null>(
		null,
	);
	const [showAddForm, setShowAddForm] = useState(false);

	const { data: asset } = useQuery({
		queryKey: ["asset", assetId],
		queryFn: () => assetApi.getAsset(assetId),
		select: (res) => res.data,
	});

	const {
		data: orders,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["mm-orders", assetId],
		queryFn: () => assetApi.getMMOrders(assetId),
		select: (res) => res.data,
	});

	const { data: orderBook } = useQuery({
		queryKey: ["orderbook", assetId],
		queryFn: () => assetApi.getOrderBook(assetId),
		select: (res) => res.data,
		refetchInterval: 10000,
	});

	const { data: recentTrades } = useQuery({
		queryKey: ["recent-trades", assetId],
		queryFn: () => assetApi.getRecentTrades(assetId),
		select: (res) => res.data,
		refetchInterval: 10000,
	});

	const invalidateAll = () => {
		queryClient.invalidateQueries({ queryKey: ["mm-orders", assetId] });
		queryClient.invalidateQueries({ queryKey: ["orderbook", assetId] });
		refetch();
	};

	const createMutation = useMutation({
		mutationFn: (data: MarketMakerOrderRequest) =>
			assetApi.createMMOrder(assetId, data),
		onSuccess: () => {
			toast.success("Order created");
			setShowAddForm(false);
			invalidateAll();
		},
		onError: (err: Error) => toast.error(err.message),
	});

	const updateMutation = useMutation({
		mutationFn: ({
			orderId,
			data,
		}: {
			orderId: string;
			data: MarketMakerOrderRequest;
		}) => assetApi.updateMMOrder(assetId, orderId, data),
		onSuccess: () => {
			toast.success("Order updated");
			setEditingOrder(null);
			invalidateAll();
		},
		onError: (err: Error) => toast.error(err.message),
	});

	const deleteMutation = useMutation({
		mutationFn: (orderId: string) => assetApi.deleteMMOrder(assetId, orderId),
		onSuccess: () => {
			toast.success("Order deleted");
			invalidateAll();
		},
		onError: (err: Error) => toast.error(err.message),
	});

	const buyOrders = (orders ?? []).filter((o) => o.side === "BUY");
	const sellOrders = (orders ?? []).filter((o) => o.side === "SELL");

	return {
		assetId,
		asset,
		buyOrders,
		sellOrders,
		isLoading,
		orderBook,
		recentTrades: recentTrades ?? [],
		showAddForm,
		setShowAddForm,
		editingOrder,
		setEditingOrder,
		onCreate: (data: MarketMakerOrderRequest) => createMutation.mutate(data),
		onUpdate: (orderId: string, data: MarketMakerOrderRequest) =>
			updateMutation.mutate({ orderId, data }),
		onDelete: (orderId: string) => deleteMutation.mutate(orderId),
		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
	};
};
