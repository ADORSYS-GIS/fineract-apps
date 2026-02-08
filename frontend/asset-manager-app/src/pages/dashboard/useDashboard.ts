import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { assetApi, type AssetResponse } from "@/services/assetApi";

export const useDashboard = () => {
	const [searchValue, setSearchValue] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [categoryFilter, setCategoryFilter] = useState<string>("");
	const pageSize = 10;

	const {
		data: assetsData,
		isLoading: isFetchingAssets,
		refetch,
	} = useQuery({
		queryKey: ["assets", currentPage, categoryFilter, searchValue],
		queryFn: () =>
			assetApi.listAssets({
				page: currentPage - 1,
				size: pageSize,
				category: categoryFilter || undefined,
				search: searchValue || undefined,
			}),
		select: (res) => res.data,
	});

	const { data: marketStatus } = useQuery({
		queryKey: ["market-status"],
		queryFn: () => assetApi.getMarketStatus(),
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

	const assets: AssetResponse[] = assetsData?.content ?? [];
	const totalPages = assetsData?.totalPages ?? 1;

	return {
		searchValue,
		onSearchValueChange: setSearchValue,
		onSearch: handleSearch,
		assets,
		isFetchingAssets,
		currentPage,
		totalPages,
		onPageChange: handlePageChange,
		categoryFilter,
		onCategoryChange: handleCategoryChange,
		marketStatus,
		refetch,
	};
};
