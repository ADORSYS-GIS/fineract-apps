import { ClientSearchData } from "@fineract-apps/fineract-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fineractApi } from "@/services/api";

export const useDashboard = () => {
	const [searchValue, setSearchValue] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const {
		data: clients,
		isLoading: isFetchingClients,
		refetch,
	} = useQuery({
		queryKey: ["clients", currentPage],
		queryFn: () =>
			fineractApi.clients.getV1Clients({
				offset: (currentPage - 1) * 6,
				limit: 6,
				orderBy: "id",
				sortOrder: "DESC",
			}),
	});

	const { mutate: searchClients, data: searchResults } = useMutation({
		mutationKey: ["searchClients"],
		mutationFn: (searchValue: string) =>
			fineractApi.clientSearchV2.postV2ClientsSearch({
				requestBody: {
					request: {
						text: searchValue,
					},
					page: currentPage - 1,
					size: 5,
				},
			}),
	});

	const handleSearch = (value: string) => {
		if (value) {
			searchClients(value);
		} else {
			refetch();
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const displayedClients = useMemo(() => {
		if (searchResults?.content) {
			return searchResults.content.map((client: ClientSearchData) => ({
				id: client.id,
				displayName: client.displayName,
				accountNo: client.accountNumber,
				officeName: client.officeName,
				status: client.status,
				emailAddress: undefined,
				mobileNo: client.mobileNo,
			}));
		}
		return clients?.pageItems ?? [];
	}, [searchResults, clients]);
	const totalPages =
		(searchResults?.totalPages ?? clients?.totalFilteredRecords)
			? Math.ceil(
					(searchResults?.totalElements ?? clients?.totalFilteredRecords ?? 0) /
						5,
				)
			: 1;

	return {
		searchValue,
		onSearchValueChange: setSearchValue,
		onSearch: handleSearch,
		clients: displayedClients,
		isFetchingClients,
		currentPage,
		totalPages,
		onPageChange: handlePageChange,
	};
};
