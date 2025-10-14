import {
	ApiError,
	SavingsAccountData,
	SavingsAccountService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const useClientSearch = () => {
	const [accountId, setAccountId] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	const queryResult = useQuery<SavingsAccountData, ApiError>({
		queryKey: ["savingsAccount", accountId, "associations"],
		queryFn: () => {
			if (!accountId) throw new Error("Invalid account ID");
			return SavingsAccountService.getV1SavingsaccountsByAccountId({
				accountId,
				associations: "all",
			});
		},
		enabled: !!accountId,
		retry: false,
	});

	useEffect(() => {
		if (queryResult.data?.id) {
			navigate({
				to: "/clients/$clientId",
				params: { clientId: String(queryResult.data.id) },
			});
		}
	}, [queryResult.data, navigate]);

	const search = (query: string) => {
		const id = parseInt(query, 10);
		if (!isNaN(id) && id > 0) {
			setAccountId(id);
		} else {
			setAccountId(null);
		}
	};

	const handleSearch = (query: string) => {
		search(query);
	};

	const { error, ...restQueryResult } = queryResult;
	const developerMessage =
		(error?.body as { developerMessage?: string })?.developerMessage ||
		error?.message;
	const searchError = developerMessage ? { message: developerMessage } : null;

	return {
		...restQueryResult,
		error: searchError,
		searchQuery,
		setSearchQuery,
		handleSearch,
	};
};
