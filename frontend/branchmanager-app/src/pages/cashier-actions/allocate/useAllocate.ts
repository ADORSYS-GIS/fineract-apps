import { TellerCashManagementService } from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { formatToFineractDate } from "@/utils/date";
import { FormValues } from "./Allocate.types";

export function useAllocate(
	tellerId: number,
	cashierId: number,
	currencyCode: string,
) {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, "0");
	const dd = String(today.getDate()).padStart(2, "0");
	const todayIso = `${yyyy}-${mm}-${dd}`;

	const initialValues: FormValues = {
		amount: 0,
		currencyCode: currencyCode || "",
		date: todayIso,
		notes: "",
	};

	const queryClient = useQueryClient();

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
		onSubmit,
		isSubmitting: mutation.isPending,
	};
}
