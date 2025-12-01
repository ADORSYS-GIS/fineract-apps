import { TellerCashManagementService } from "@fineract-apps/fineract-api";
import { formatToFineractDate, getBusinessDate } from "@fineract-apps/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

export const cashierActionSchema = z.object({
	amount: z.coerce.number().gt(0, "Amount must be greater than 0"),
	currencyCode: z.string().min(1, "Currency is required"),
	date: z.string().min(1, "Date is required"),
	notes: z.string().optional(),
});

export type CashierActionFormValues = z.infer<typeof cashierActionSchema>;

type ActionType = "allocate" | "settle";

const serviceActions = {
	allocate:
		TellerCashManagementService.postV1TellersByTellerIdCashiersByCashierIdAllocate,
	settle:
		TellerCashManagementService.postV1TellersByTellerIdCashiersByCashierIdSettle,
};

const successMessages = {
	allocate: "Cash allocated successfully",
	settle: "Cash settled successfully",
};

const errorMessages = {
	allocate: "Failed to allocate cash",
	settle: "Failed to settle cash",
};

export function useCashierAction(
	actionType: ActionType,
	tellerId: number,
	cashierId: number,
	currencyCode: string,
) {
	const [businessDate, setBusinessDate] = useState("");

	useEffect(() => {
		const fetchBusinessDate = async () => {
			const date = await getBusinessDate();
			setBusinessDate(date);
		};
		fetchBusinessDate();
	}, []);

	const initialValues: CashierActionFormValues = {
		amount: 0,
		currencyCode: currencyCode ?? "",
		date: businessDate || "",
		notes: "",
	};

	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: async (values: CashierActionFormValues) => {
			const serviceAction = serviceActions[actionType];
			return serviceAction({
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
			if (actionType === "settle") {
				queryClient.invalidateQueries({ queryKey: ["tellers"] });
			}
			navigate({
				to: "/tellers/$tellerId/cashiers/$cashierId",
				params: { tellerId: String(tellerId), cashierId: String(cashierId) },
				search: { page: 1, pageSize: 10 },
			});
			toast.success(successMessages[actionType]);
		},
		onError: () => {
			toast.error(errorMessages[actionType]);
		},
	});

	const onSubmit = (values: CashierActionFormValues) => {
		mutation.mutate(values);
	};

	return {
		initialValues,
		onSubmit,
		isSubmitting: mutation.isPending,
	};
}
