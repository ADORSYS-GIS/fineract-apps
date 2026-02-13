import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { assetApi, extractErrorMessage } from "@/services/assetApi";

export const usePricing = () => {
	const { assetId } = useParams({ from: "/pricing/$assetId" });
	const queryClient = useQueryClient();
	const [period, setPeriod] = useState("1M");

	const { data: asset } = useQuery({
		queryKey: ["asset", assetId],
		queryFn: () => assetApi.getAssetAdmin(assetId),
		select: (res) => res.data,
	});

	const { data: price, isLoading: isLoadingPrice } = useQuery({
		queryKey: ["price", assetId],
		queryFn: () => assetApi.getPrice(assetId),
		select: (res) => res.data,
		refetchInterval: 15000,
	});

	const { data: priceHistory, isLoading: isLoadingHistory } = useQuery({
		queryKey: ["price-history", assetId, period],
		queryFn: () => assetApi.getPriceHistory(assetId, period),
		select: (res) => res.data?.points ?? [],
	});

	const setPriceMutation = useMutation({
		mutationFn: (newPrice: number) =>
			assetApi.setPrice(assetId, { price: newPrice }),
		onSuccess: () => {
			toast.success("Price updated");
			queryClient.invalidateQueries({ queryKey: ["price", assetId] });
			queryClient.invalidateQueries({ queryKey: ["asset", assetId] });
			queryClient.invalidateQueries({ queryKey: ["assets"] });
		},
		onError: (err: unknown) => toast.error(extractErrorMessage(err)),
	});

	return {
		assetId,
		asset,
		price,
		isLoadingPrice,
		priceHistory: priceHistory ?? [],
		isLoadingHistory,
		period,
		setPeriod,
		onSetPrice: (p: number) => setPriceMutation.mutate(p),
		isSettingPrice: setPriceMutation.isPending,
	};
};
