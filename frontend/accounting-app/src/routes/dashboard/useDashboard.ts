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
			// Placeholder - in production, fetch from Fineract API
			// const glAccounts = await GLAccountsService.getV1Glaccounts();
			// const journalEntries = await JournalEntriesService.getV1Journalentries({ fromDate: today });

			return {
				glAccountsCount: 0,
				journalEntriesToday: 0,
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
