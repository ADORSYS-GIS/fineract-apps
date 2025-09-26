import {
	ApiError,
	ClientService,
	SavingsAccountTransactionsService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
	TransactionFormData,
	TransactionType,
} from "../TransactionForm/TransactionForm.types";
import { TransactionRequestBody } from "./ClientDetails.types";
import { useClientImage } from "./useClientImage";

export const useClientDetails = (clientId: number) => {
	const queryClient = useQueryClient();
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [transactionType, setTransactionType] =
		useState<TransactionType | null>(null);
	const [transactionError, setTransactionError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedAccount, setSelectedAccount] = useState<{
		id?: number;
		accountNo?: string;
	} | null>(null);

	const {
		data: client,
		isLoading: isClientLoading,
		isError: isClientError,
		error: clientError,
	} = useQuery({
		queryKey: ["client", clientId],
		queryFn: () => ClientService.getV1ClientsByClientId({ clientId }),
	});
	const {
		data: clientAccounts,
		isLoading: isAccountsLoading,
		isError: isAccountsError,
		error: accountsError,
	} = useQuery({
		queryKey: ["clientAccounts", clientId],
		queryFn: () => ClientService.getV1ClientsByClientIdAccounts({ clientId }),
		enabled: !!client,
	});

	const { data: clientImage, isLoading: isClientImageLoading } = useClientImage(
		String(clientId),
	);

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
			const transactionDate = `${date.getDate()} ${date.toLocaleString("en", { month: "long" })} ${date.getFullYear()}`;
			const transactionAmount = parseFloat(body.amount);
			return SavingsAccountTransactionsService.postV1SavingsaccountsBySavingsIdTransactions(
				{
					savingsId,
					command,
					requestBody: {
						locale: "en",
						dateFormat: "dd MMMM yyyy",
						transactionDate,
						transactionAmount,
						paymentTypeId: 1,
						receiptNumber: body.receiptNumber,
					} as TransactionRequestBody,
				},
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["client", clientId] });
			queryClient.invalidateQueries({ queryKey: ["clientAccounts", clientId] });
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
	const handleDeposit = (accountId: number) => {
		const account = clientAccounts?.savingsAccounts?.find(
			(acc) => acc.id === accountId,
		);
		if (account) {
			setTransactionError(null);
			setTransactionType("deposit");
			setSelectedAccount(account);
			setIsSuccess(false);
		}
	};
	const handleWithdraw = (accountId: number) => {
		const account = clientAccounts?.savingsAccounts?.find(
			(acc) => acc.id === accountId,
		);
		if (account) {
			setTransactionError(null);
			setTransactionType("withdrawal");
			setSelectedAccount(account);
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
	const handleOpenImageModal = () => setIsImageModalOpen(true);
	const handleCloseImageModal = () => setIsImageModalOpen(false);
	return {
		client,
		clientAccounts,
		clientImage,
		isLoading: isClientLoading || isAccountsLoading,
		isClientImageLoading,
		isError: isClientError || isAccountsError,
		error: clientError || accountsError,
		isImageModalOpen,
		isTransactionModalOpen: !!transactionType,
		transactionType,
		transactionError,
		onDeposit: handleDeposit,
		onWithdraw: handleWithdraw,
		onCloseTransactionModal: handleCloseTransactionModal,
		onOpenImageModal: handleOpenImageModal,
		onCloseImageModal: handleCloseImageModal,
		onSubmitTransaction: handleSubmitTransaction,
		isSubmitting: transactionMutation.isPending,
		isSuccess,
		selectedAccount,
	};
};
