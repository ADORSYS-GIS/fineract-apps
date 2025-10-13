import {
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

	const queryResult = useQuery<SavingsAccountData, Error>({
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
		if (queryResult.data?.clientId) {
			navigate({
				to: "/clients/$clientId",
				params: { clientId: String(queryResult.data.clientId) },
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

	return { ...queryResult, searchQuery, setSearchQuery, handleSearch };
};
