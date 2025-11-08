import {
	LoanTransactionsService,
	PaymentTypeService,
	PostLoansLoanIdTransactionsRequest,
	PostLoansLoanIdTransactionsResponse,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const useRepaymentForm = (
	loanId: number,
	setTransactionId: (id: number | null) => void,
) => {
	const { t } = useTranslation();
	const [amount, setAmount] = useState("");
	const [paymentTypeId, setPaymentTypeId] = useState("");
	const [transactionDate, setTransactionDate] = useState(new Date());
	const [note, setNote] = useState("");

	const queryClient = useQueryClient();

	const { data: paymentTypes } = useQuery({
		queryKey: ["paymentTypes"],
		queryFn: () => PaymentTypeService.getV1Paymenttypes(),
	});

	const mutation = useMutation<
		PostLoansLoanIdTransactionsResponse,
		Error,
		PostLoansLoanIdTransactionsRequest
	>({
		mutationFn: (repaymentRequest: PostLoansLoanIdTransactionsRequest) =>
			LoanTransactionsService.postV1LoansByLoanIdTransactions({
				loanId,
				command: "repayment",
				requestBody: repaymentRequest,
			}),
		onSuccess: (data) => {
			toast.success(t("repaymentSuccessful"));
			setTransactionId(data.resourceId ?? null);
			queryClient.invalidateQueries({ queryKey: ["loan", loanId] });
			queryClient.invalidateQueries({ queryKey: ["loanTransactions", loanId] });
		},
		onError: (error) => {
			toast.error(t("repaymentFailed", { message: error.message }));
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const repaymentRequest: PostLoansLoanIdTransactionsRequest = {
			dateFormat: "dd MMMM yyyy",
			locale: "en",
			transactionDate: format(transactionDate, "dd MMMM yyyy"),
			transactionAmount: parseFloat(amount),
			paymentTypeId: parseInt(paymentTypeId, 10),
			note,
		};
		mutation.mutate(repaymentRequest);
	};

	return {
		amount,
		setAmount,
		paymentTypeId,
		setPaymentTypeId,
		transactionDate,
		setTransactionDate,
		note,
		setNote,
		handleSubmit,
		isLoading: mutation.isPending,
		paymentTypes: paymentTypes || [],
	};
};
