import {
	GetClientsSavingsAccounts,
	GetV1SavingsaccountsByAccountIdResponse,
} from "@fineract-apps/fineract-api";

export interface SavingsAccountCardProps {
	account: GetClientsSavingsAccounts;
	onDeposit: (accountId: number) => void;
	onWithdraw: (accountId: number) => void;
}

export interface SavingsAccountCardViewProps {
	accountDetails: GetV1SavingsaccountsByAccountIdResponse | undefined;
	isLoading: boolean;
	isError: boolean;
	onDeposit: (accountId: number) => void;
	onWithdraw: (accountId: number) => void;
}
