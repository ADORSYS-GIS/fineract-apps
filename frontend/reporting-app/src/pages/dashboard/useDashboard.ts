import {
	AuditsService,
	LoansService,
	ReportsService,
} from "@fineract-apps/fineract-api";
import { useQueries } from "@tanstack/react-query";
import type { DashboardData } from "./Dashboard.types";

export function useDashboard(): DashboardData {
	const [reportsQuery, auditsQuery, loansQuery] = useQueries({
		queries: [
			{
				queryKey: ["reports"],
				queryFn: () => ReportsService.getV1Reports(),
			},
			{
				queryKey: ["audits"],
				queryFn: () => AuditsService.getV1Audits({}),
			},
			{
				queryKey: ["loans"],
				queryFn: () => LoansService.getV1Loans({}),
			},
		],
	});

	const totalReports = reportsQuery.data?.length ?? 0;
	const auditEntries = auditsQuery.data?.length ?? 0;
	const recentTransactions = loansQuery.data?.pageItems?.length ?? 0; // Using loans as proxy for transactions

	return {
		stats: {
			totalReports,
			recentTransactions,
			auditEntries,
		},
	};
}
