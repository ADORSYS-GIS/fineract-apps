import {
	GeneralLedgerAccountService,
	JournalEntriesService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import "../../lib/api";

export interface AccountingStats {
	glAccountsCount: number;
	journalEntriesToday: number;
	pendingApprovals: number;
	totalBalance: number;
}

export function useDashboard() {
	const { data: stats, isLoading } = useQuery<AccountingStats>({
		queryKey: ["accounting-stats"],
		queryFn: async () => {
			const today = new Date().toISOString().split("T")[0];

			// Fetch GL accounts count
			const glAccountsResponse =
				await GeneralLedgerAccountService.getV1GlAccounts({
					disabled: false,
				});
			const glAccounts = glAccountsResponse as unknown as Array<{
				id: number;
			}>;
			const glAccountsCount = glAccounts?.length || 0;

			// Fetch journal entries for today
			const journalEntriesResponse =
				await JournalEntriesService.getV1Journalentries({
					fromDate: today,
					toDate: today,
				});
			const journalEntries = journalEntriesResponse as unknown as Array<{
				id: number;
			}>;
			const journalEntriesToday = journalEntries?.length || 0;

			// Note: Pending approvals and total balance would need additional API calls
			// For now, returning 0 as placeholders until we implement maker-checker workflow

			return {
				glAccountsCount,
				journalEntriesToday,
				pendingApprovals: 0,
				totalBalance: 0,
			};
		},
	});

	return {
		stats,
		isLoading,
	};
}
