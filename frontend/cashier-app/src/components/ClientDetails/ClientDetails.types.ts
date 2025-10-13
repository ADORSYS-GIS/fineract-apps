import {
	PostSavingsAccountTransactionsRequest,
	SavingsAccountData,
} from "@fineract-apps/fineract-api";
import {
	TransactionFormData,
	TransactionType,
} from "../TransactionForm/TransactionForm.types";
export type TransactionRequestBody = PostSavingsAccountTransactionsRequest & {
	receiptNumber?: string;
};

export interface ClientDetailsViewProps {
	savingsAccount: SavingsAccountData;
	clientImage?: string;
	isClientImageLoading: boolean;
	isImageModalOpen: boolean;
	isTransactionModalOpen: boolean;
	transactionType: TransactionType | null;
	transactionError: string | null;
	onDeposit: () => void;
	onWithdraw: () => void;
	onCloseTransactionModal: () => void;
	onOpenImageModal: () => void;
	onCloseImageModal: () => void;
	onSubmitTransaction: (values: TransactionFormData) => void;
	isSubmitting: boolean;
	isSuccess: boolean;
	selectedAccount: {
		id?: number;
		accountNo?: string;
	} | null;
}
