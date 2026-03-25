import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { assetApi } from "@/services/assetApi";

export type AccountingTab = "trial-balance" | "fee-tax-summary";

export const useAccounting = () => {
	const [activeTab, setActiveTab] = useState<AccountingTab>("trial-balance");
	const [currencyCode, setCurrencyCode] = useState("XAF");
	const [fromDate, setFromDate] = useState<string>("");
	const [toDate, setToDate] = useState<string>("");

	const queryParams = {
		currencyCode,
		fromDate: fromDate || undefined,
		toDate: toDate || undefined,
	};

	const {
		data: trialBalance,
		isLoading: isLoadingTrialBalance,
		isError: isErrorTrialBalance,
		refetch: refetchTrialBalance,
	} = useQuery({
		queryKey: ["trial-balance", currencyCode, fromDate, toDate],
		queryFn: () => assetApi.getTrialBalance(queryParams),
		select: (res) => res.data,
	});

	const {
		data: feeTaxSummary,
		isLoading: isLoadingFeeTax,
		isError: isErrorFeeTax,
		refetch: refetchFeeTax,
	} = useQuery({
		queryKey: ["fee-tax-summary", currencyCode, fromDate, toDate],
		queryFn: () => assetApi.getFeeTaxSummary(queryParams),
		select: (res) => res.data,
	});

	const refetch = () => {
		refetchTrialBalance();
		refetchFeeTax();
	};

	return {
		activeTab,
		setActiveTab,
		currencyCode,
		setCurrencyCode,
		fromDate,
		setFromDate,
		toDate,
		setToDate,
		trialBalance,
		isLoadingTrialBalance,
		isErrorTrialBalance,
		feeTaxSummary,
		isLoadingFeeTax,
		isErrorFeeTax,
		refetch,
	};
};
