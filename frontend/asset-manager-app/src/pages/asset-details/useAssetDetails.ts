import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import toast from "react-hot-toast";
import {
	assetApi,
	type AssetResponse,
	type UpdateAssetRequest,
} from "@/services/assetApi";

export const useAssetDetails = () => {
	const { assetId } = useParams({ from: "/asset-details/$assetId" });
	const queryClient = useQueryClient();

	const {
		data: asset,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["asset", assetId],
		queryFn: () => assetApi.getAsset(assetId),
		select: (res) => res.data as AssetResponse,
	});

	const { data: orderBook } = useQuery({
		queryKey: ["orderbook", assetId],
		queryFn: () => assetApi.getOrderBook(assetId),
		select: (res) => res.data,
	});

	const { data: price } = useQuery({
		queryKey: ["price", assetId],
		queryFn: () => assetApi.getPrice(assetId),
		select: (res) => res.data,
		refetchInterval: 30000,
	});

	const updateMutation = useMutation({
		mutationFn: (data: UpdateAssetRequest) =>
			assetApi.updateAsset(assetId, data),
		onSuccess: () => {
			toast.success("Asset updated");
			refetch();
		},
		onError: (err: Error) => toast.error(err.message),
	});

	const activateMutation = useMutation({
		mutationFn: () => assetApi.activateAsset(assetId),
		onSuccess: () => {
			toast.success("Asset activated");
			refetch();
		},
		onError: (err: Error) => toast.error(err.message),
	});

	const haltMutation = useMutation({
		mutationFn: () => assetApi.haltAsset(assetId),
		onSuccess: () => {
			toast.success("Trading halted");
			refetch();
		},
		onError: (err: Error) => toast.error(err.message),
	});

	const resumeMutation = useMutation({
		mutationFn: () => assetApi.resumeAsset(assetId),
		onSuccess: () => {
			toast.success("Trading resumed");
			refetch();
		},
		onError: (err: Error) => toast.error(err.message),
	});

	const setPriceMutation = useMutation({
		mutationFn: (newPrice: number) =>
			assetApi.setPrice(assetId, { price: newPrice }),
		onSuccess: () => {
			toast.success("Price updated");
			queryClient.invalidateQueries({ queryKey: ["price", assetId] });
			refetch();
		},
		onError: (err: Error) => toast.error(err.message),
	});

	return {
		assetId,
		asset,
		isLoading,
		orderBook,
		price,
		onUpdate: (data: UpdateAssetRequest) => updateMutation.mutate(data),
		onActivate: () => activateMutation.mutate(),
		onHalt: () => haltMutation.mutate(),
		onResume: () => resumeMutation.mutate(),
		onSetPrice: (newPrice: number) => setPriceMutation.mutate(newPrice),
		isUpdating: updateMutation.isPending,
	};
};
