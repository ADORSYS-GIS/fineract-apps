import { useQuery } from "@tanstack/react-query";
import { assetApi, type PortfolioSummaryResponse } from "@/services/assetApi";

export const usePortfolio = () => {
	const {
		data: portfolio,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["portfolio"],
		queryFn: () => assetApi.getPortfolio(),
		select: (res) => res.data,
	});

	const summary: PortfolioSummaryResponse = portfolio ?? {
		totalValue: 0,
		totalCostBasis: 0,
		unrealizedPnl: 0,
		unrealizedPnlPercent: 0,
		estimatedAnnualYieldPercent: undefined,
		positions: [],
	};

	return {
		summary,
		positions: summary.positions,
		isLoading,
		isError,
		refetch,
	};
};
