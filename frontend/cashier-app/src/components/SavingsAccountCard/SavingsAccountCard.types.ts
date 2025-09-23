import { GetClientsSavingsAccounts } from "@fineract-apps/fineract-api";

export interface SavingsAccountCardProps {
	account: GetClientsSavingsAccounts;
	onDeposit: (accountId: number) => void;
	onWithdraw: (accountId: number) => void;
}

export interface SavingsAccountCardViewProps {
	account: GetClientsSavingsAccounts;
	accountBalance: number | undefined;
	isLoading: boolean;
	isError: boolean;
	onDeposit: (accountId: number) => void;
	onWithdraw: (accountId: number) => void;
}
