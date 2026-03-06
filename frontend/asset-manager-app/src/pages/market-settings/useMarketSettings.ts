import { useQuery } from "@tanstack/react-query";
import { assetApi, type MarketStatusResponse } from "@/services/assetApi";

export const useMarketSettings = () => {
	const {
		data: marketStatus,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["market-status"],
		queryFn: () => assetApi.getMarketStatus(),
		select: (res) => res.data as MarketStatusResponse,
		refetchInterval: 10000,
	});

	return {
		marketStatus,
		isLoading,
		isError,
		refetch,
	};
};
