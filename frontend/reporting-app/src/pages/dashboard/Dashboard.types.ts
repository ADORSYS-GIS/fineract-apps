export interface DashboardStats {
	totalReports: number;
	recentTransactions: number;
	auditEntries: number;
}

export interface DashboardData {
	stats: DashboardStats;
}
