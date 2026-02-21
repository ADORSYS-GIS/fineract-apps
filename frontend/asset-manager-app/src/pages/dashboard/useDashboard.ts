import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useMemo, useState } from "react";
import { type AssetResponse, assetApi } from "@/services/assetApi";

export const useDashboard = () => {
	const [searchValue, setSearchValue] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [categoryFilter, setCategoryFilter] = useState<string>("");
	const pageSize = 10;

	// Debounce search to avoid triggering filter on every keystroke
	const debouncedSearch = useDeferredValue(searchValue);

	const {
		data: assetsData,
		isLoading: isFetchingAssets,
		isError: isAssetsError,
		refetch,
	} = useQuery({
		queryKey: ["assets", currentPage],
		queryFn: () =>
			assetApi.listAllAssets({
				page: currentPage - 1,
				size: pageSize,
			}),
		select: (res) => res.data,
	});

	const { data: marketStatus } = useQuery({
		queryKey: ["market-status"],
		queryFn: () => assetApi.getMarketStatus(),
		select: (res) => res.data,
		refetchInterval: 30000,
	});

	const { data: dashboardSummary } = useQuery({
		queryKey: ["dashboard-summary"],
		queryFn: () => assetApi.getDashboardSummary(),
		select: (res) => res.data,
		refetchInterval: 30000,
	});

	const handleSearch = (value: string) => {
		setSearchValue(value);
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleCategoryChange = (category: string) => {
		setCategoryFilter(category);
		setCurrentPage(1);
	};

	const allAssets: AssetResponse[] = assetsData?.content ?? [];
	const totalPages = assetsData?.totalPages ?? 1;

	// Client-side filtering (admin endpoint doesn't support search/category params)
	const assets = useMemo(() => {
		let filtered = allAssets;
		if (categoryFilter) {
			filtered = filtered.filter((a) => a.category === categoryFilter);
		}
		if (debouncedSearch) {
			const q = debouncedSearch.toLowerCase();
			filtered = filtered.filter(
				(a) =>
					a.name.toLowerCase().includes(q) ||
					a.symbol.toLowerCase().includes(q),
			);
		}
		return filtered;
	}, [allAssets, categoryFilter, debouncedSearch]);

	return {
		searchValue,
		onSearchValueChange: setSearchValue,
		onSearch: handleSearch,
		assets,
		isFetchingAssets,
		isAssetsError,
		currentPage,
		totalPages,
		onPageChange: handlePageChange,
		categoryFilter,
		onCategoryChange: handleCategoryChange,
		marketStatus,
		dashboardSummary,
		refetch,
	};
};
