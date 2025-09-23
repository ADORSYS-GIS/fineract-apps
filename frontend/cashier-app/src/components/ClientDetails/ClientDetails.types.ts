import {
	GetClientsClientIdAccountsResponse,
	GetClientsClientIdResponse,
} from "@fineract-apps/fineract-api";
import {
	TransactionFormData,
	TransactionType,
} from "../TransactionForm/TransactionForm.types";
export interface ClientDetailsViewProps {
	client: GetClientsClientIdResponse;
	clientAccounts: GetClientsClientIdAccountsResponse | undefined;
	clientImage: string | undefined;
	isClientImageLoading: boolean;
	isImageModalOpen: boolean;
	isTransactionModalOpen: boolean;
	transactionType: TransactionType | null;
	transactionError: string | null;
	onDeposit: (accountId: number) => void;
	onWithdraw: (accountId: number) => void;
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
