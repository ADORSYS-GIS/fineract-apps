import { Card } from "@fineract-apps/ui";
import { BarChart3, History, Shield } from "lucide-react";
import type { DashboardData } from "./Dashboard.types";

export function DashboardView({ stats }: DashboardData) {
	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">Reporting Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 mb-1">Total Reports</p>
							<p className="text-2xl font-bold">{stats.totalReports}</p>
						</div>
						<BarChart3 className="w-10 h-10 text-blue-500" />
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 mb-1">Recent Transactions</p>
							<p className="text-2xl font-bold">{stats.recentTransactions}</p>
						</div>
						<History className="w-10 h-10 text-green-500" />
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 mb-1">Audit Entries</p>
							<p className="text-2xl font-bold">{stats.auditEntries}</p>
						</div>
						<Shield className="w-10 h-10 text-purple-500" />
					</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-6">
				<Card className="p-6">
					<h2 className="text-xl font-semibold mb-4">Quick Access</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<a
							href="/reporting/reports"
							className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<div className="flex items-center">
								<BarChart3 className="w-5 h-5 mr-3 text-blue-500" />
								<div>
									<p className="font-medium">View All Reports</p>
									<p className="text-sm text-gray-600">
										Access reports catalog
									</p>
								</div>
							</div>
						</a>
						<a
							href="/reporting/transactions"
							className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<div className="flex items-center">
								<History className="w-5 h-5 mr-3 text-green-500" />
								<div>
									<p className="font-medium">Transaction History</p>
									<p className="text-sm text-gray-600">View all transactions</p>
								</div>
							</div>
						</a>
						<a
							href="/reporting/audit"
							className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<div className="flex items-center">
								<Shield className="w-5 h-5 mr-3 text-purple-500" />
								<div>
									<p className="font-medium">Audit Trail</p>
									<p className="text-sm text-gray-600">
										View system audit logs
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
