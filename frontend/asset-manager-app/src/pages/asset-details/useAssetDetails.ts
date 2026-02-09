import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import toast from "react-hot-toast";
import {
	type AssetResponse,
	assetApi,
	extractErrorMessage,
	type UpdateAssetRequest,
} from "@/services/assetApi";

export const useAssetDetails = () => {
	const { assetId } = useParams({ from: "/asset-details/$assetId" });
	const queryClient = useQueryClient();

	const {
		data: asset,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["asset", assetId],
		queryFn: () => assetApi.getAsset(assetId),
		select: (res) => res.data as AssetResponse,
	});

	const { data: price } = useQuery({
		queryKey: ["price", assetId],
		queryFn: () => assetApi.getPrice(assetId),
		select: (res) => res.data,
		refetchInterval: 30000,
	});

	const invalidateAll = () => {
		queryClient.invalidateQueries({ queryKey: ["asset", assetId] });
		queryClient.invalidateQueries({ queryKey: ["assets"] });
	};

	const updateMutation = useMutation({
		mutationFn: (data: UpdateAssetRequest) =>
			assetApi.updateAsset(assetId, data),
		onSuccess: () => {
			toast.success("Asset updated");
			invalidateAll();
		},
		onError: (err: unknown) => toast.error(extractErrorMessage(err)),
	});

	const activateMutation = useMutation({
		mutationFn: () => assetApi.activateAsset(assetId),
		onSuccess: () => {
			toast.success("Asset activated");
			invalidateAll();
		},
		onError: (err: unknown) => toast.error(extractErrorMessage(err)),
	});

	const haltMutation = useMutation({
		mutationFn: () => assetApi.haltAsset(assetId),
		onSuccess: () => {
			toast.success("Trading halted");
			invalidateAll();
		},
		onError: (err: unknown) => toast.error(extractErrorMessage(err)),
	});

	const resumeMutation = useMutation({
		mutationFn: () => assetApi.resumeAsset(assetId),
		onSuccess: () => {
			toast.success("Trading resumed");
			invalidateAll();
		},
		onError: (err: unknown) => toast.error(extractErrorMessage(err)),
	});

	const setPriceMutation = useMutation({
		mutationFn: (newPrice: number) =>
			assetApi.setPrice(assetId, { price: newPrice }),
		onSuccess: () => {
			toast.success("Price updated");
			queryClient.invalidateQueries({ queryKey: ["price", assetId] });
			invalidateAll();
		},
		onError: (err: unknown) => toast.error(extractErrorMessage(err)),
	});

	return {
		assetId,
		asset,
		isLoading,
		isError,
		refetch,
		price,
		onUpdate: (data: UpdateAssetRequest) => updateMutation.mutate(data),
		onActivate: () => activateMutation.mutate(),
		onHalt: () => haltMutation.mutate(),
		onResume: () => resumeMutation.mutate(),
		onSetPrice: (newPrice: number) => setPriceMutation.mutate(newPrice),
		isUpdating: updateMutation.isPending,
		isActivating: activateMutation.isPending,
		isHalting: haltMutation.isPending,
		isResuming: resumeMutation.isPending,
		isSettingPrice: setPriceMutation.isPending,
	};
};
