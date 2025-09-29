import {
	useTellerCashManagementServiceGetV1Tellers,
	useTellerCashManagementServiceGetV1TellersByTellerIdCashiers,
	useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate,
	useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdSettle,
} from "@fineract-apps/fineract-api";
import { useMemo, useState } from "react";
import { CashierItem, SettleValues, TellerItem } from "./SettleFunds.types";

const isCashiersResponse = (
	value: unknown,
): value is { cashiers: CashierItem[] } => {
	if (typeof value !== "object" || value === null) return false;
	return Array.isArray((value as { cashiers?: unknown }).cashiers);
};

export function formatDateToLongDayMonthYear(input: string): string {
	if (!input) return "";
	const [y, m, d] = input.split("-").map((v) => Number(v));
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const monthName = monthNames[(m || 1) - 1] ?? "January";
	return `${d} ${monthName} ${y}`;
}

export function useSettleFunds() {
	const initialValues: SettleValues = {
		tellerId: "",
		cashierId: "",
		amount: "",
		currencyCode: "XAF",
		date: "",
		notes: "",
	};

	const { data: tellers, isLoading: loadingTellers } =
		useTellerCashManagementServiceGetV1Tellers({}, ["tellers"], {
			staleTime: 60_000,
		});

	const tellerOptions = useMemo(() => {
		if (!Array.isArray(tellers)) return [] as TellerItem[];
		return tellers.filter((t): t is TellerItem => {
			if (typeof t !== "object" || t === null) return false;
			const c = t as { id?: unknown };
			return typeof c.id === "number";
		});
	}, [tellers]);

	const firstTellerId = tellerOptions[0]?.id ?? null;

	const [pickerTellerId, setPickerTellerId] = useState<number | null>(
		firstTellerId,
	);
	const [pickerCashierId, setPickerCashierId] = useState<number | null>(null);
	const [selectedTellerId, setSelectedTellerId] = useState<number | null>(null);
	const [selectedCashierId, setSelectedCashierId] = useState<number | null>(
		null,
	);
	const hasSelection = selectedTellerId !== null && selectedCashierId !== null;

	const { data: cashiersResp, isLoading: loadingCashiers } =
		useTellerCashManagementServiceGetV1TellersByTellerIdCashiers(
			{ tellerId: Number(pickerTellerId ?? 0) },
			["tellers", pickerTellerId, "cashiers"],
			{ enabled: pickerTellerId !== null, staleTime: 30_000 },
		);

	const cashierOptions = useMemo(() => {
		if (!isCashiersResponse(cashiersResp)) return [] as CashierItem[];
		return cashiersResp.cashiers.filter((c): c is CashierItem => {
			if (typeof c !== "object" || c === null) return false;
			const candidate = c as { id?: unknown };
			return typeof candidate.id === "number";
		});
	}, [cashiersResp]);

	const settleMutation =
		useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdSettle();

	const { data: template, isLoading: loadingTemplate } =
		useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate(
			{
				tellerId: Number(selectedTellerId ?? 0),
				cashierId: Number(selectedCashierId ?? 0),
			},
			["tellers", selectedTellerId, "cashiers", selectedCashierId, "template"],
			{ enabled: hasSelection },
		);

	const currencyOptions = useMemo(() => {
		const options =
			(
				template as unknown as
					| { currencyOptions?: { code: string; displayLabel?: string }[] }
					| undefined
			)?.currencyOptions ?? [];
		return options.map((c) => ({
			label: c.displayLabel ?? c.code,
			value: c.code,
		}));
	}, [template]);

	const defaultCurrencyCode = currencyOptions[0]?.value ?? "XAF";

	return {
		initialValues,
		loadingTellers,
		tellerOptions,
		pickerTellerId,
		setPickerTellerId,
		pickerCashierId,
		setPickerCashierId,
		loadingCashiers,
		cashierOptions,
		selectedTellerId,
		setSelectedTellerId,
		selectedCashierId,
		setSelectedCashierId,
		hasSelection,
		loadingTemplate,
		currencyOptions,
		defaultCurrencyCode,
		settleMutation,
	};
}
