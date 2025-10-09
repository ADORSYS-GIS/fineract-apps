import {
	TellerCashManagementService,
	useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdSettle,
} from "@fineract-apps/fineract-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import { FormValues } from "./Settle.types";

function formatToFineractDate(value: string): string {
	const date = new Date(value + "T00:00:00");
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export function useSettle(tellerId: number, cashierId: number) {
	const initialValues: FormValues = {
		amount: 0,
		currencyCode: "XAF",
		date: "",
		notes: "",
	};

	const mutation =
		useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdSettle();

	const { data: template, isLoading: loadingTemplate } = useQuery({
		queryKey: ["tellers", tellerId, "cashiers", cashierId, "template"],
		queryFn: async () =>
			(await TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate(
				{
					tellerId,
					cashierId,
				},
			)) ?? [],
	});

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

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const onSubmit = (values: FormValues) => {
		const promise = mutation.mutateAsync({
			tellerId,
			cashierId,
			requestBody: {
				txnAmount: Number(values.amount),
				currencyCode: values.currencyCode,
				txnDate: formatToFineractDate(values.date),
				txnNote: values.notes ?? "",
				dateFormat: "dd MMMM yyyy",
				locale: "en",
			},
		});

		toast.promise(promise, {
			loading: "Settling cash...",
			success: () => {
				// Invalidate relevant queries so detail & lists reflect latest balances/transactions
				queryClient.invalidateQueries({
					queryKey: [
						"tellers",
						tellerId,
						"cashiers",
						cashierId,
						"summary-transactions",
					],
				});
				queryClient.invalidateQueries({
					queryKey: ["tellers", tellerId, "cashiers"],
				});
				queryClient.invalidateQueries({ queryKey: ["tellers"] });
				navigate({ to: "/tellers", search: { page: 1, pageSize: 10, q: "" } });
				return "Cash settled successfully";
			},
			error: "Failed to settle cash",
		});
	};

	return {
		initialValues,
		loadingTemplate,
		currencyOptions,
		defaultCurrencyCode,
		onSubmit,
		isSubmitting: mutation.isPending,
		error: mutation.error,
		isSuccess: mutation.isSuccess,
	};
}
