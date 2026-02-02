import type { SavingsAccount } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import { API_CONFIG, apiFetch, createAccountsHeaders } from "./api";

/**
 * Accounts API Response Types
 *
 * These responses are from the customer-self-service backend which wraps
 * Fineract API calls with ownership verification.
 */

export interface AccountsListResponse {
	accounts: SavingsAccount[];
	summary?: {
		totalBalance: number;
		totalAccounts: number;
	};
}

export interface AccountDetailsResponse extends SavingsAccount {
	// Extended fields from customer-self-service
}

export interface TransactionsResponse {
	transactions: Transaction[];
	totalFilteredRecords?: number;
}

/**
 * Customer Self-Service Accounts API
 *
 * These endpoints go through customer-self-service which provides:
 * - Ownership verification (customer can only access their own accounts)
 * - Multi-account support (customer can have multiple accounts)
 * - Rate limiting and audit logging
 *
 * The customer identity is extracted from the JWT token (fineract_client_id claim).
 */
export const accountsApi = {
	/**
	 * Get all savings accounts for the authenticated customer
	 *
	 * No clientId parameter needed - the backend extracts it from the JWT token.
	 * Returns only accounts owned by the authenticated customer.
	 */
	async getSavingsAccounts(accessToken: string): Promise<SavingsAccount[]> {
		const response = await apiFetch<AccountsListResponse>(
			`${API_CONFIG.accounts.baseUrl}/savings`,
			{
				headers: createAccountsHeaders(accessToken),
			},
		);

		return response.accounts || [];
	},

	/**
	 * Get a specific savings account by ID
	 *
	 * Includes ownership verification - returns 403 if account doesn't belong
	 * to the authenticated customer.
	 */
	async getSavingsAccount(
		accountId: number,
		accessToken: string,
	): Promise<SavingsAccount> {
		return apiFetch<SavingsAccount>(
			`${API_CONFIG.accounts.baseUrl}/savings/${accountId}`,
			{
				headers: createAccountsHeaders(accessToken),
			},
		);
	},

	/**
	 * Get transactions for a savings account
	 *
	 * Includes ownership verification - returns 403 if account doesn't belong
	 * to the authenticated customer.
	 */
	async getTransactions(
		accountId: number,
		accessToken: string,
	): Promise<Transaction[]> {
		const response = await apiFetch<TransactionsResponse>(
			`${API_CONFIG.accounts.baseUrl}/savings/${accountId}/transactions`,
			{
				headers: createAccountsHeaders(accessToken),
			},
		);

		return response.transactions || [];
	},

	/**
	 * Get all loan accounts for the authenticated customer
	 *
	 * No clientId parameter needed - the backend extracts it from the JWT token.
	 * Returns only loan accounts owned by the authenticated customer.
	 */
	async getLoanAccounts(accessToken: string): Promise<unknown[]> {
		const response = await apiFetch<{ accounts: unknown[] }>(
			`${API_CONFIG.accounts.baseUrl}/loans`,
			{
				headers: createAccountsHeaders(accessToken),
			},
		);

		return response.accounts || [];
	},

	/**
	 * Get a specific loan account by ID
	 *
	 * Includes ownership verification - returns 403 if loan doesn't belong
	 * to the authenticated customer.
	 */
	async getLoanAccount(loanId: number, accessToken: string): Promise<unknown> {
		return apiFetch(`${API_CONFIG.accounts.baseUrl}/loans/${loanId}`, {
			headers: createAccountsHeaders(accessToken),
		});
	},
};
