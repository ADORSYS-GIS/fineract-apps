import { useQuery } from "@tanstack/react-query";
import { assetApi } from "@/services/assetApi";

export const useLPPerformance = () => {
	const {
		data: performance,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["lp-performance"],
		queryFn: () => assetApi.getLPPerformance(),
		select: (res) => res.data,
		refetchInterval: 60000,
	});

	return {
		performance,
		isLoading,
		isError,
		refetch,
	};
};
