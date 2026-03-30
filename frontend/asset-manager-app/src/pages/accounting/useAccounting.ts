import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { assetApi } from "@/services/assetApi";

export const useAccounting = () => {
	const [currencyCode, setCurrencyCode] = useState("XAF");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [hideInactive, setHideInactive] = useState(true);
	const [activeTab, setActiveTab] = useState<
		"trial-balance" | "income-statement" | "balance-sheet" | "tax-report"
	>("trial-balance");

	const {
		data: trialBalance,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["trial-balance", currencyCode, fromDate, toDate],
		queryFn: () => assetApi.getTrialBalance({ currencyCode, fromDate, toDate }),
		select: (res) => res.data,
	});

	const { data: currencies } = useQuery({
		queryKey: ["accounting-currencies"],
		queryFn: () => assetApi.getAccountingCurrencies(),
		select: (res) => res.data,
	});

	return {
		trialBalance,
		currencies: currencies ?? ["XAF"],
		currencyCode,
		setCurrencyCode,
		fromDate,
		setFromDate,
		toDate,
		setToDate,
		isLoading,
		isError,
		refetch,
		hideInactive,
		setHideInactive,
		activeTab,
		setActiveTab,
	};
};
