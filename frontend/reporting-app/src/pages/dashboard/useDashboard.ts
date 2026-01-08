import type { DashboardData } from "./Dashboard.types";

export function useDashboard(): DashboardData {
	// TODO: Fetch real data from API
	return {
		stats: {
			totalReports: 0,
			recentTransactions: 0,
			auditEntries: 0,
			generatedReports: 0,
		},
	};
}
