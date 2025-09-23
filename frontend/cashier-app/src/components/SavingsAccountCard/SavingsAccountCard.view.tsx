import { Button } from '@fineract-apps/ui';
import { SavingsAccountCardViewProps } from './SavingsAccountCard.types';

export const SavingsAccountCardView: React.FC<SavingsAccountCardViewProps> = ({
  account,
  accountBalance,
  isLoading,
  isError,
  onDeposit,
  onWithdraw,
}) => {
  if (isLoading) {
    return <div className="p-4 border rounded-lg">Loading account details...</div>;
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
      key={account.id}
      className="p-4 border rounded-lg flex justify-between items-center"
    >
      <div>
        <p className="font-semibold">{account.productName}</p>
        <p className="text-sm text-gray-600">
          Account No: {account.accountNo}
        </p>
        <p className="text-sm text-gray-600">Balance: {accountBalance}</p>
      </div>
      {account.status?.active && (
        <div className="flex gap-2">
          <Button onClick={() => onDeposit(account.id!)}>Deposit</Button>
          <Button onClick={() => onWithdraw(account.id!)} variant="outline">
            Withdrawal
          </Button>
        </div>
      )}
    </div>
  );
};