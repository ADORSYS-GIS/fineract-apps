import {
	TellerCashManagementService,
	useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdAllocate,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "react-hot-toast";
import { FormValues } from "./Allocate.types";

function formatToFineractDate(value: string): string {
	const date = new Date(value + "T00:00:00");
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export function useAllocate(tellerId: number, cashierId: number) {
	const initialValues: FormValues = {
		amount: 0,
		currencyCode: "XAF",
		date: "",
		notes: "",
	};

	const mutation =
		useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdAllocate();

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
			loading: "Allocating cash...",
			success: () => {
				navigate({ to: "/tellers", search: { page: 1, pageSize: 10, q: "" } });
				return "Cash allocated successfully";
			},
			error: "Failed to allocate cash",
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
