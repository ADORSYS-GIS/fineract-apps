import {
	ApiError,
	SavingsAccountService,
	SavingsAccountTransactionsService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { TransactionRequestBody } from "@/components/ClientDetails/ClientDetails.types";
import {
	TransactionFormData,
	TransactionType,
} from "@/components/TransactionForm/TransactionForm.types";

export const useClientDetails = (savingsId: number) => {
	const queryClient = useQueryClient();
	const [transactionType, setTransactionType] =
		useState<TransactionType | null>(null);
	const [transactionError, setTransactionError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedAccount, setSelectedAccount] = useState<{
		id?: number;
		accountNo?: string;
	} | null>(null);

	const {
		data: savingsAccount,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["savingsAccount", savingsId, "associations"],
		queryFn: () =>
			SavingsAccountService.getV1SavingsaccountsByAccountId({
				accountId: savingsId,
				associations: "all",
			}),
	});

	const transactionMutation = useMutation({
		mutationFn: ({
			savingsId,
			command,
			body,
		}: {
			savingsId: number;
			command: "deposit" | "withdrawal";
			body: TransactionFormData;
		}) => {
			const date = new Date();
			const transactionDate = format(date, "yyyy-MM-dd HH:mm:ss");
			const transactionAmount = parseFloat(body.amount);
			return SavingsAccountTransactionsService.postV1SavingsaccountsBySavingsIdTransactions(
				{
					savingsId,
					command,
					requestBody: {
						locale: "en",
						dateFormat: "yyyy-MM-dd HH:mm:ss",
						transactionDate,
						transactionAmount,
						paymentTypeId: 5,
						receiptNumber: body.receiptNumber,
					} as TransactionRequestBody,
				},
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["savingsAccount", savingsId, "associations"],
			});
			queryClient.invalidateQueries({ queryKey: ["cashierSummary"] });
			setIsSuccess(true);
			setTimeout(() => {
				handleCloseTransactionModal();
				setIsSuccess(false);
			}, 2000);
		},
		onError: (err: ApiError) => {
			const body = err.body as { errors?: { defaultUserMessage: string }[] };
			const apiError = body?.errors?.[0]?.defaultUserMessage;
			setTransactionError(apiError ?? "An unexpected error occurred.");
		},
	});
	const handleDeposit = () => {
		if (savingsAccount) {
			setTransactionError(null);
			setTransactionType("deposit");
			setSelectedAccount(savingsAccount);
			setIsSuccess(false);
		}
	};
	const handleWithdraw = () => {
		if (savingsAccount) {
			setTransactionError(null);
			setTransactionType("withdrawal");
			setSelectedAccount(savingsAccount);
			setIsSuccess(false);
		}
	};
	const handleCloseTransactionModal = () => {
		setTransactionType(null);
		setTransactionError(null);
		setSelectedAccount(null);
		setIsSuccess(false);
	};
	const handleSubmitTransaction = (values: TransactionFormData) => {
		if (selectedAccount?.id && transactionType) {
			transactionMutation.mutate({
				savingsId: selectedAccount.id,
				command: transactionType,
				body: values,
			});
		} else {
			setTransactionError(
				"No account was selected for this transaction. Please try again.",
			);
		}
	};
	return {
		savingsAccount,
		isLoading,
		isError,
		error,
		isTransactionModalOpen: !!transactionType,
		transactionType,
		transactionError,
		onDeposit: handleDeposit,
		onWithdraw: handleWithdraw,
		onCloseTransactionModal: handleCloseTransactionModal,
		onSubmitTransaction: handleSubmitTransaction,
		isSubmitting: transactionMutation.isPending,
		isSuccess,
		selectedAccount,
	};
};
