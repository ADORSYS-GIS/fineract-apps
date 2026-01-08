export interface DashboardStats {
	totalReports: number;
	recentTransactions: number;
	auditEntries: number;
	generatedReports: number;
}

export interface DashboardData {
	stats: DashboardStats;
}
