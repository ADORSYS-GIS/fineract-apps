import { TellerCashManagementService } from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

	const queryClient = useQueryClient();
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

	const mutation = useMutation({
		mutationFn: async (values: FormValues) => {
			return TellerCashManagementService.postV1TellersByTellerIdCashiersByCashierIdAllocate(
				{
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
				},
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["tellers", tellerId, "cashiers"],
			});
			queryClient.invalidateQueries({
				queryKey: [
					"tellers",
					tellerId,
					"cashiers",
					cashierId,
					"summary-transactions",
				],
			});
			navigate({
				to: "/tellers/$tellerId/cashiers/$cashierId",
				params: { tellerId: String(tellerId), cashierId: String(cashierId) },
				search: { page: 1, pageSize: 10 },
			});
			toast.success("Cash allocated successfully");
		},
		onError: () => {
			toast.error("Failed to allocate cash");
		},
	});

	const onSubmit = (values: FormValues) => {
		mutation.mutate(values);
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
