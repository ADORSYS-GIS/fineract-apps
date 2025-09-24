import { SavingsAccountCardProps } from "./SavingsAccountCard.types";
import { SavingsAccountCardView } from "./SavingsAccountCard.view";
import { useSavingsAccountCard } from "./useSavingsAccountCard";

export const SavingsAccountCard: React.FC<SavingsAccountCardProps> = ({
	account,
	onDeposit,
	onWithdraw,
}) => {
	const { accountDetails, isLoading, isError } = useSavingsAccountCard(
		account.id!,
	);

	return (
		<SavingsAccountCardView
			accountDetails={accountDetails}
			isLoading={isLoading}
			isError={isError}
			onDeposit={() => onDeposit(account.id!)}
			onWithdraw={() => onWithdraw(account.id!)}
		/>
	);
};
