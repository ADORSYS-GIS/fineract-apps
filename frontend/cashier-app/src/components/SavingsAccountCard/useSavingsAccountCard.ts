import { useQuery } from '@tanstack/react-query';
import { SavingsAccountService } from '@fineract-apps/fineract-api';

export const useSavingsAccountCard = (accountId: number) => {
  const {
    data: accountDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['savingsAccount', accountId],
    queryFn: () =>
      SavingsAccountService.getV1SavingsaccountsByAccountId({
        accountId,
      }),
    enabled: !!accountId,
  });

  return {
    accountBalance: accountDetails?.summary?.accountBalance,
    isLoading,
    isError,
  };
};