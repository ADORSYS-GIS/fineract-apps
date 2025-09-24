import { Button } from "@fineract-apps/ui";
import { formatCurrency } from "@/utils/currency";
import { formatDateArray } from "@/utils/date";
import { SavingsAccountCardViewProps } from "./SavingsAccountCard.types";

export const SavingsAccountCardView: React.FC<SavingsAccountCardViewProps> = ({
	accountDetails,
	isLoading,
	isError,
	onDeposit,
	onWithdraw,
}) => {
	if (isLoading) {
		return (
			<div className="p-4 border rounded-lg">Loading account details...</div>
		);
	}

	if (isError) {
		return (
			<div className="p-4 border rounded-lg text-red-500">
				Error loading account balance.
			</div>
		);
	}

	return (
		<div
			key={accountDetails?.id}
			className="block md:grid md:grid-cols-5 md:gap-4 p-4 md:items-center text-gray-700"
		>
			<div className="flex justify-between md:block">
				<span className="font-semibold md:hidden">Account No.: </span>
				<span>{accountDetails?.accountNo}</span>
			</div>
			<div className="flex justify-between md:block">
				<span className="font-semibold md:hidden">Savings Product: </span>
				<span>{accountDetails?.savingsProductName}</span>
			</div>
			<div className="flex justify-between md:block">
				<span className="font-semibold md:hidden">Last Active: </span>
				<span>
					{formatDateArray(
						accountDetails?.lastActiveTransactionDate as unknown as
							| number[]
							| undefined,
					) ?? "N/A"}
				</span>
			</div>
			<div className="flex justify-between md:block">
				<span className="font-semibold md:hidden">Balance: </span>
				<span>{formatCurrency(accountDetails?.summary?.accountBalance)}</span>
			</div>
			{accountDetails?.status?.active && (
				<div className="flex flex-col gap-2 mt-4 md:mt-0">
					<Button onClick={() => onDeposit(accountDetails?.id!)}>
						Deposit
					</Button>
					<Button
						onClick={() => onWithdraw(accountDetails?.id!)}
						variant="outline"
					>
						Withdrawal
					</Button>
				</div>
			)}
		</div>
	);
};
