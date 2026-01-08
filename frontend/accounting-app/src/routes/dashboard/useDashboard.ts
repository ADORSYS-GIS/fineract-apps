import {
	GeneralLedgerAccountService,
	type GetGLAccountsResponse,
	type GetV1JournalentriesResponse,
	type GetV1MakercheckersResponse,
	JournalEntriesService,
	MakerCheckerOr4EyeFunctionalityService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import "../../lib/api";
import { format } from "date-fns";

export interface AccountingStats {
	glAccountsCount: number;
	journalEntriesToday: number;
	pendingApprovals: number;
	totalBalance: number;
	recentActivities: Array<{
		id: string;
		type: string;
		title: string;
		description: string;
		amount: number | undefined;
		entryType: string | undefined;
		timestamp: string | undefined;
		icon: string;
		color: string;
	}>;
}

export function useDashboard() {
	const { data: stats, isLoading } = useQuery<AccountingStats>({
		queryKey: ["accounting-stats"],
		queryFn: async () => {
			const today = format(new Date(), "yyyy-MM-dd");

			// Fetch GL accounts and calculate total balance
			const glAccountsResponse =
				(await GeneralLedgerAccountService.getV1Glaccounts({
					disabled: false,
				})) as GetGLAccountsResponse[];
			const glAccountsCount = glAccountsResponse?.length || 0;
			const totalBalance =
				glAccountsResponse?.reduce(
					(acc, account) => acc + (account.organizationRunningBalance || 0),
					0,
				) || 0;

			// Fetch journal entries for today
			const journalEntriesResponse =
				(await JournalEntriesService.getV1Journalentries({
					fromDate: today,
					toDate: today,
					dateFormat: "yyyy-MM-dd",
					locale: "en",
				} as unknown as Parameters<
					typeof JournalEntriesService.getV1Journalentries
				>[0])) as GetV1JournalentriesResponse;
			const journalEntriesToday =
				journalEntriesResponse?.pageItems?.length || 0;

			// Fetch pending approvals count
			const approvalsResponse =
				(await MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers(
					{},
				)) as GetV1MakercheckersResponse[];
			const pendingApprovals = approvalsResponse?.length || 0;

			// Fetch recent journal entries (representing recent accounting activities)
			const recentEntriesResponse =
				(await JournalEntriesService.getV1Journalentries({
					limit: 10,
					offset: 0,
				})) as GetV1JournalentriesResponse;

			// Create activity items from journal entries
			const recentActivities = (recentEntriesResponse?.pageItems || []).map(
				(entry) => ({
					id: `entry-${entry.id}`,
					type: "journal_entry",
					title: `Journal Entry #${entry.transactionId || entry.id}`,
					description: `Created on ${entry.transactionDate ? new Date(entry.transactionDate).toLocaleDateString() : "N/A"}`,
					amount: entry.amount,
					entryType: entry.entryType?.value,
					timestamp: entry.transactionDate,
					icon: "FileText",
					color: "blue",
				}),
			);

			return {
				glAccountsCount,
				journalEntriesToday,
				pendingApprovals,
				totalBalance,
				recentActivities,
			};
		},
	});

	return {
		stats,
		isLoading,
	};
}
