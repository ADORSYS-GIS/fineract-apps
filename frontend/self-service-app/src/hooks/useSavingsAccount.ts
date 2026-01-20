import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

export interface SavingsAccount {
  id: string;
  accountNo: string;
  productName: string;
  status: {
    id: number;
    code: string;
    value: string;
  };
  currency: {
    code: string;
    name: string;
    decimalPlaces: number;
    displaySymbol: string;
  };
  accountBalance: number;
  availableBalance: number;
}

async function fetchSavingsAccounts(
  clientId: string,
  accessToken: string
): Promise<SavingsAccount[]> {
  const response = await fetch(
    `${import.meta.env.VITE_FINERACT_API_URL || "/fineract-provider/api/v1"}/savingsaccounts?clientId=${clientId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Fineract-Platform-TenantId": import.meta.env.VITE_FINERACT_TENANT_ID || "default",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch savings accounts");
  }

  const data = await response.json();

  return (data.pageItems || []).map((account: Record<string, unknown>) => ({
    id: (account.id as number).toString(),
    accountNo: account.accountNo as string,
    productName: (account.savingsProductName || account.productName) as string,
    status: account.status as SavingsAccount["status"],
    currency: account.currency as SavingsAccount["currency"],
    accountBalance: (account.accountBalance as number) || 0,
    availableBalance: (account.availableBalance as number) || (account.accountBalance as number) || 0,
  }));
}

export function useSavingsAccounts(clientId: string | undefined) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["savingsAccounts", clientId],
    queryFn: () => {
      if (!clientId || !auth.user?.access_token) {
        throw new Error("Not authenticated");
      }
      return fetchSavingsAccounts(clientId, auth.user.access_token);
    },
    enabled: !!clientId && !!auth.user?.access_token,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function usePrimarySavingsAccount(clientId: string | undefined) {
  const { data: accounts, ...rest } = useSavingsAccounts(clientId);

  // Return the first active account as primary
  const primaryAccount = accounts?.find(
    (acc) => acc.status.code === "savingsAccountStatusType.active"
  ) || accounts?.[0];

  return {
    ...rest,
    data: primaryAccount,
  };
}
