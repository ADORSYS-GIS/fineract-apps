import {
	ApiError,
	GetLoansResponse,
	LoansService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useLoanSearch = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	const queryResult = useQuery<GetLoansResponse, ApiError>({
		queryKey: ["loanAccount", searchQuery],
		queryFn: () => {
			if (!searchQuery) throw new Error("Invalid account number");
			return LoansService.getV1Loans({
				accountNo: searchQuery,
				associations: "all",
			});
		},
		enabled: !!searchQuery,
		retry: false,
	});

	useEffect(() => {
		if (queryResult.isError) {
			const error = queryResult.error as ApiError;
			const errorBody = error?.body as {
				developerMessage?: string;
				errors?: { defaultUserMessage?: string }[];
			};
			const detailedMessage = errorBody?.errors?.[0]?.defaultUserMessage;
			const developerMessage =
				detailedMessage ?? errorBody?.developerMessage ?? error?.message;
			toast.error(developerMessage, {
				duration: 5000,
			});
		}
		if (queryResult.data?.pageItems && queryResult.data.pageItems.length > 0) {
			const loan = queryResult.data.pageItems[0];
			if (loan.id) {
				navigate({
					to: "/repayment/$loanId",
					params: { loanId: String(loan.id) },
				});
			}
		} else if (queryResult.data) {
			toast.error("Loan not found");
		}
	}, [queryResult.data, queryResult.isError, queryResult.error, navigate]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	return {
		...queryResult,
		searchQuery,
		setSearchQuery,
		handleSearch,
	};
};