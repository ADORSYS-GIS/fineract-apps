import { SavingsAccountCardProps } from "./SavingsAccountCard.types";
import { SavingsAccountCardView } from "./SavingsAccountCard.view";
import { useSavingsAccountCard } from "./useSavingsAccountCard";

export const SavingsAccountCard: React.FC<SavingsAccountCardProps> = ({
	account,
	onDeposit,
	onWithdraw,
}) => {
	const { accountBalance, isLoading, isError } = useSavingsAccountCard(
		account.id!,
	);

	return (
		<SavingsAccountCardView
			account={account}
			accountBalance={accountBalance}
			isLoading={isLoading}
			isError={isError}
			onDeposit={() => onDeposit(account.id!)}
			onWithdraw={() => onWithdraw(account.id!)}
		/>
	);
};
