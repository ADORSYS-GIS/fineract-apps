import { Card } from "@fineract-apps/ui";
import { BookOpen, FileText, Lock, TrendingUp } from "lucide-react";
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
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Accounting Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">GL Accounts</p>
							<p className="text-3xl font-bold">{stats?.glAccountsCount || 0}</p>
						</div>
						<BookOpen className="h-12 w-12 text-blue-500" />
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Journal Entries (Today)</p>
							<p className="text-3xl font-bold">{stats?.journalEntriesToday || 0}</p>
						</div>
						<FileText className="h-12 w-12 text-green-500" />
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Pending Approvals</p>
							<p className="text-3xl font-bold">{stats?.pendingApprovals || 0}</p>
						</div>
						<Lock className="h-12 w-12 text-orange-500" />
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Account Balance</p>
							<p className="text-3xl font-bold">
								${stats?.totalBalance?.toLocaleString() || "0"}
							</p>
						</div>
						<TrendingUp className="h-12 w-12 text-purple-500" />
					</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="p-6">
					<h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
					<div className="space-y-2">
						<a
							href="/accounting/gl-accounts"
							className="block p-3 hover:bg-gray-50 rounded border"
						>
							<p className="font-medium">View GL Accounts</p>
							<p className="text-sm text-gray-600">Browse chart of accounts</p>
						</a>
						<a
							href="/accounting/journal-entries"
							className="block p-3 hover:bg-gray-50 rounded border"
						>
							<p className="font-medium">View Journal Entries</p>
							<p className="text-sm text-gray-600">Browse all accounting entries</p>
						</a>
						<a
							href="/accounting/create-entry"
							className="block p-3 hover:bg-gray-50 rounded border"
						>
							<p className="font-medium">Create Manual Entry</p>
							<p className="text-sm text-gray-600">Record new transaction</p>
						</a>
					</div>
				</Card>

				<Card className="p-6">
					<h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
					<div className="text-center text-gray-500 py-8">
						<FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
						<p>Recent journal entries will appear here</p>
					</div>
				</Card>
			</div>
		</div>
	);
}
