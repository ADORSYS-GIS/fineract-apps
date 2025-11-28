import {
	BusinessDateManagementService,
	GeneralLedgerAccountService,
	JournalEntriesService,
	MakerCheckerOr4EyeFunctionalityService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import "../../lib/api";

export interface AccountingStats {
	glAccountsCount: number;
	journalEntriesToday: number;
	pendingApprovals: number;
	totalBalance: number;
	recentJournalEntries: Array<{
		id: number;
		transactionId: string;
		transactionDate: string;
	}>;
	pendingApprovalsList: Array<{
		id: number;
		actionName: string;
		entityName: string;
	}>;
}

export function useDashboard() {
	const { data: stats, isLoading } = useQuery<AccountingStats>({
		queryKey: ["accounting-stats"],
		queryFn: async () => {
			const today = new Date().toISOString().split("T")[0];

			// Fetch GL accounts count
			const glAccountsResponse =
				await GeneralLedgerAccountService.getV1Glaccounts({
					disabled: false,
				});
			const glAccounts = glAccountsResponse as unknown as Array<{
				id: number;
			}>;
			const glAccountsCount = glAccounts?.length || 0;

			// Fetch journal entries for today
			await BusinessDateManagementService.postV1Businessdate({
				requestBody: {
					type: "BUSINESS_DATE",
					date: today,
					locale: "en",
					dateFormat: "yyyy-MM-dd",
				},
			});
			const journalEntriesResponse =
				await JournalEntriesService.getV1Journalentries({
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					fromDate: today as any,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					toDate: today as any,
					limit: 10,
					locale: "en",
					dateFormat: "yyyy-MM-dd",
				});
			const journalEntries = journalEntriesResponse as unknown as {
				pageItems: Array<{
					id: number;
					transactionId: string;
					transactionDate: string;
				}>;
			};
			const journalEntriesToday = journalEntries?.pageItems?.length || 0;
			const recentJournalEntries = journalEntries?.pageItems || [];

			// Fetch pending approvals count
			const approvalsResponse =
				await MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers({});
			const approvals = approvalsResponse as unknown as {
				pageItems: Array<{
					id: number;
					actionName: string;
					entityName: string;
				}>;
			};
			const pendingApprovals = approvals?.pageItems?.length || 0;
			const pendingApprovalsList = approvals?.pageItems || [];

			// Note: Total balance would need additional calculation
			// For now, returning 0 as placeholder

			return {
				glAccountsCount,
				journalEntriesToday,
				pendingApprovals,
				totalBalance: 0,
				recentJournalEntries,
				pendingApprovalsList,
			};
		},
	});

	return {
		stats,
		isLoading,
	};
}
