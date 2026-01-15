import { Card } from "@fineract-apps/ui";
import { BarChart3, History, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DashboardData } from "./Dashboard.types";

export function DashboardView({ stats }: DashboardData) {
	const { t } = useTranslation();
	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">{t("dashboard.title")}</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 mb-1">
								{t("dashboard.totalReports")}
							</p>
							<p className="text-2xl font-bold">{stats.totalReports}</p>
						</div>
						<BarChart3 className="w-10 h-10 text-gray-800" />
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 mb-1">
								{t("dashboard.recentTransactions")}
							</p>
							<p className="text-2xl font-bold">{stats.recentTransactions}</p>
						</div>
						<History className="w-10 h-10 text-gray-800" />
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 mb-1">
								{t("dashboard.auditEntries")}
							</p>
							<p className="text-2xl font-bold">{stats.auditEntries}</p>
						</div>
						<Shield className="w-10 h-10 text-gray-800" />
					</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-6">
				<Card className="p-6">
					<h2 className="text-xl font-semibold mb-4">
						{t("dashboard.quickAccess")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<a
							href="/reporting/reports"
							className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<div className="flex items-center">
								<BarChart3 className="w-5 h-5 mr-3 text-gray-800" />
								<div>
									<p className="font-medium">{t("dashboard.viewAllReports")}</p>
									<p className="text-sm text-gray-600">
										{t("dashboard.viewAllReportsDescription")}
									</p>
								</div>
							</div>
						</a>
						<a
							href="/reporting/transactions"
							className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<div className="flex items-center">
								<History className="w-5 h-5 mr-3 text-gray-800" />
								<div>
									<p className="font-medium">
										{t("dashboard.transactionHistory")}
									</p>
									<p className="text-sm text-gray-600">
										{t("dashboard.transactionHistoryDescription")}
									</p>
								</div>
							</div>
						</a>
						<a
							href="/reporting/audit"
							className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<div className="flex items-center">
								<Shield className="w-5 h-5 mr-3 text-gray-800" />
								<div>
									<p className="font-medium">{t("dashboard.auditTrail")}</p>
									<p className="text-sm text-gray-600">
										{t("dashboard.auditTrailDescription")}
									</p>
								</div>
							</div>
						</a>
					</div>
				</Card>
			</div>
		</div>
	);
}
