import { API_CONFIG, apiFetch, createFineractHeaders } from "./api";

export interface Client {
  id: number;
  accountNo: string;
  externalId: string;
  status: {
    id: number;
    code: string;
    value: string;
  };
  active: boolean;
  activationDate?: number[];
  firstname: string;
  lastname: string;
  displayName: string;
  mobileNo?: string;
  emailAddress?: string;
  dateOfBirth?: number[];
  gender?: {
    id: number;
    name: string;
  };
}

export interface SavingsAccount {
  id: number;
  accountNo: string;
  clientId: number;
  clientName: string;
  savingsProductId: number;
  savingsProductName: string;
  fieldOfficerId?: number;
  status: {
    id: number;
    code: string;
    value: string;
    submittedAndPendingApproval: boolean;
    approved: boolean;
    rejected: boolean;
    withdrawnByApplicant: boolean;
    active: boolean;
    closed: boolean;
  };
  currency: {
    code: string;
    name: string;
    decimalPlaces: number;
    displaySymbol: string;
    nameCode: string;
    displayLabel: string;
  };
  accountBalance: number;
  availableBalance?: number;
}

export interface SavingsTransaction {
  id: number;
  transactionType: {
    id: number;
    code: string;
    value: string;
    deposit: boolean;
    withdrawal: boolean;
    interestPosting: boolean;
    feeDeduction: boolean;
  };
  accountId: number;
  accountNo: string;
  date: number[];
  currency: {
    code: string;
    name: string;
    decimalPlaces: number;
    displaySymbol: string;
  };
  amount: number;
  runningBalance: number;
  reversed: boolean;
  submittedOnDate: number[];
  paymentDetail?: {
    id: number;
    paymentType: {
      id: number;
      name: string;
    };
    accountNumber?: string;
    checkNumber?: string;
    routingCode?: string;
    receiptNumber?: string;
    bankNumber?: string;
  };
}

export interface DepositRequest {
  locale: string;
  dateFormat: string;
  transactionDate: string;
  transactionAmount: number;
  paymentTypeId: number;
  receiptNumber?: string;
}

export interface WithdrawalRequest {
  locale: string;
  dateFormat: string;
  transactionDate: string;
  transactionAmount: number;
  paymentTypeId: number;
  receiptNumber?: string;
}

/**
 * Fineract API client
 */
export const fineractApi = {
  /**
   * Get client by external ID
   */
  async getClientByExternalId(
    externalId: string,
    accessToken: string
  ): Promise<Client> {
    const response = await apiFetch<{ pageItems: Client[] }>(
      `${API_CONFIG.fineract.baseUrl}/clients?externalId=${externalId}`,
      {
        headers: createFineractHeaders(accessToken),
      }
    );

    if (!response.pageItems?.[0]) {
      throw new Error("Client not found");
    }

    return response.pageItems[0];
  },

  /**
   * Get client by ID
   */
  async getClient(clientId: number, accessToken: string): Promise<Client> {
    return apiFetch<Client>(
      `${API_CONFIG.fineract.baseUrl}/clients/${clientId}`,
      {
        headers: createFineractHeaders(accessToken),
      }
    );
  },

  /**
   * Get savings accounts for a client
   */
  async getSavingsAccounts(
    clientId: number,
    accessToken: string
  ): Promise<SavingsAccount[]> {
    const response = await apiFetch<{ pageItems: SavingsAccount[] }>(
      `${API_CONFIG.fineract.baseUrl}/savingsaccounts?clientId=${clientId}`,
      {
        headers: createFineractHeaders(accessToken),
      }
    );

    return response.pageItems || [];
  },

  /**
   * Get savings account by ID
   */
  async getSavingsAccount(
    accountId: number,
    accessToken: string
  ): Promise<SavingsAccount> {
    return apiFetch<SavingsAccount>(
      `${API_CONFIG.fineract.baseUrl}/savingsaccounts/${accountId}`,
      {
        headers: createFineractHeaders(accessToken),
      }
    );
  },

  /**
   * Get transactions for a savings account
   */
  async getTransactions(
    accountId: number,
    accessToken: string
  ): Promise<SavingsTransaction[]> {
    const response = await apiFetch<{
      transactions: SavingsTransaction[];
    }>(
      `${API_CONFIG.fineract.baseUrl}/savingsaccounts/${accountId}/transactions`,
      {
        headers: createFineractHeaders(accessToken),
      }
    );

    return response.transactions || [];
  },

  /**
   * Make a deposit
   */
  async deposit(
    accountId: number,
    data: DepositRequest,
    accessToken: string
  ): Promise<{ savingsId: number; resourceId: number }> {
    return apiFetch(
      `${API_CONFIG.fineract.baseUrl}/savingsaccounts/${accountId}/transactions?command=deposit`,
      {
        method: "POST",
        headers: createFineractHeaders(accessToken),
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Make a withdrawal
   */
  async withdraw(
    accountId: number,
    data: WithdrawalRequest,
    accessToken: string
  ): Promise<{ savingsId: number; resourceId: number }> {
    return apiFetch(
      `${API_CONFIG.fineract.baseUrl}/savingsaccounts/${accountId}/transactions?command=withdrawal`,
      {
        method: "POST",
        headers: createFineractHeaders(accessToken),
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Get payment types
   */
  async getPaymentTypes(
    accessToken: string
  ): Promise<{ id: number; name: string; isSystemDefined: boolean }[]> {
    return apiFetch(
      `${API_CONFIG.fineract.baseUrl}/paymenttypes`,
      {
        headers: createFineractHeaders(accessToken),
      }
    );
  },
};
