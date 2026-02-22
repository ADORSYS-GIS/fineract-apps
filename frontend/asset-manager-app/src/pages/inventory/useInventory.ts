import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { assetApi, type InventoryItem } from "@/services/assetApi";

export const useInventory = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 20;

	const {
		data: inventoryData,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["inventory", currentPage],
		queryFn: () =>
			assetApi.getInventory({ page: currentPage - 1, size: pageSize }),
		select: (res) => res.data,
	});

	const inventory: InventoryItem[] = inventoryData?.content ?? [];
	const totalPages = inventoryData?.totalPages ?? 1;

	return {
		inventory,
		isLoading,
		isError,
		refetch,
		currentPage,
		totalPages,
		onPageChange: setCurrentPage,
	};
};
