import { useQuery } from "@tanstack/react-query";
import { assetApi, type InventoryItem } from "@/services/assetApi";

export const useInventory = () => {
	const {
		data: inventory,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["inventory"],
		queryFn: () => assetApi.getInventory(),
		select: (res) => res.data as InventoryItem[],
	});

	return {
		inventory: inventory ?? [],
		isLoading,
		isError,
		refetch,
	};
};
