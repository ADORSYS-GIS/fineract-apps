import { Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { BookOpen, FileText, Lock, TrendingUp } from "lucide-react";
import { PageHeader } from "../../components";
import type { AccountingStats } from "./useDashboard";

interface DashboardViewProps {
	stats: AccountingStats | undefined;
	isLoading: boolean;
}

export function DashboardView({ stats, isLoading }: DashboardViewProps) {
	if (isLoading) {
		return (
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-6">Accounting Dashboard</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{[...Array(4)].map((_, i) => (
						<Card key={i} className="p-6">
							<div className="animate-pulse">
								<div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
								<div className="h-8 bg-gray-200 rounded w-3/4" />
							</div>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 bg-gray-200 min-h-screen">
			<PageHeader title="Accounting Dashboard" />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 mb-1">
								GL Accounts
							</p>
							<p className="text-3xl font-bold text-gray-900">
								{stats?.glAccountsCount || 0}
							</p>
						</div>
						<div className="p-3 bg-blue-50 rounded-lg">
							<BookOpen className="h-8 w-8 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 mb-1">
								Journal Entries (Today)
							</p>
							<p className="text-3xl font-bold text-gray-900">
								{stats?.journalEntriesToday || 0}
							</p>
						</div>
						<div className="p-3 bg-green-50 rounded-lg">
							<FileText className="h-8 w-8 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 mb-1">
								Pending Approvals
							</p>
							<p className="text-3xl font-bold text-gray-900">
								{stats?.pendingApprovals || 0}
							</p>
						</div>
						<div className="p-3 bg-orange-50 rounded-lg">
							<Lock className="h-8 w-8 text-orange-600" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 mb-1">
								Total Balance
							</p>
							<p className="text-3xl font-bold text-gray-900">
								${stats?.totalBalance?.toLocaleString() || "0"}
							</p>
						</div>
						<div className="p-3 bg-purple-50 rounded-lg">
							<TrendingUp className="h-8 w-8 text-purple-600" />
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Quick Actions
					</h2>
					<div className="space-y-3">
						<Link
							to="/gl-accounts"
							className="block p-4 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
						>
							<p className="font-medium text-gray-900 group-hover:text-blue-600">
								View GL Accounts
							</p>
							<p className="text-sm text-gray-600">Browse chart of accounts</p>
						</Link>
						<Link
							to="/journal-entries"
							className="block p-4 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
						>
							<p className="font-medium text-gray-900 group-hover:text-blue-600">
								View Journal Entries
							</p>
							<p className="text-sm text-gray-600">
								Browse all accounting entries
							</p>
						</Link>
						<Link
							to="/create-entry"
							className="block p-4 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
						>
							<p className="font-medium text-gray-900 group-hover:text-blue-600">
								Create Manual Entry
							</p>
							<p className="text-sm text-gray-600">Record new transaction</p>
						</Link>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Recent Activity
					</h2>
					{stats?.recentActivities && stats.recentActivities.length > 0 ? (
						<div className="space-y-3">
							{stats.recentActivities.slice(0, 5).map((activity) => (
								<div
									key={activity.id}
									className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
								>
									<div className="flex items-center gap-3">
										<div className="p-2 bg-blue-50 rounded-lg">
											<FileText className="h-4 w-4 text-blue-600" />
										</div>
										<div>
											<p className="text-sm font-medium text-gray-900">
												{activity.title}
											</p>
											<p className="text-xs text-gray-600">
												{activity.description}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium text-gray-900">
											${activity.amount?.toLocaleString() || "0"}
										</p>
										<p className="text-xs text-gray-600 capitalize">
											{activity.entryType?.toLowerCase() || "N/A"}
										</p>
									</div>
								</div>
							))}
							{stats.recentActivities.length > 5 && (
								<div className="text-center pt-2">
									<Link
										to="/journal-entries"
										className="text-sm text-blue-600 hover:text-blue-700"
									>
										View all entries →
									</Link>
								</div>
							)}
						</div>
					) : (
						<div className="text-center text-gray-500 py-8">
							<div className="p-3 bg-gray-50 rounded-full w-fit mx-auto mb-3">
								<FileText className="h-8 w-8 text-gray-400" />
							</div>
							<p className="text-sm">No recent activity</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
