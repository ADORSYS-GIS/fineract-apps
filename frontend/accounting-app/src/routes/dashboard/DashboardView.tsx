import { Card } from "@fineract-apps/ui";
import { BookOpen, FileText, Lock, TrendingUp } from "lucide-react";
import type { AccountingStats } from "./useDashboard";

interface DashboardViewProps {
	stats: AccountingStats | undefined;
	isLoading: boolean;
}

const RecentJournalEntriesCard = ({
	entries,
}: {
	entries: AccountingStats["recentJournalEntries"];
}) => {
	return (
		<Card title="Recent Activity" className="p-6">
			{entries && entries.length > 0 ? (
				<div className="space-y-2">
					{entries.map((entry) => (
						<a
							key={entry.id}
							href={`/accounting/journal-entries/${entry.id}`}
							className="block p-3 hover:bg-gray-50 rounded border"
						>
							<p className="font-medium">{entry.transactionId}</p>
							<p className="text-sm text-gray-600">
								{new Date(entry.transactionDate).toLocaleDateString()}
							</p>
						</a>
					))}
				</div>
			) : (
				<div className="text-center text-gray-500 py-8">
					<FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
					<p>No recent journal entries</p>
				</div>
			)}
		</Card>
	);
};

const PendingApprovalsCard = ({
	approvals,
}: {
	approvals: AccountingStats["pendingApprovalsList"];
}) => {
	return (
		<Card title="Pending Approvals" className="p-6">
			{approvals && approvals.length > 0 ? (
				<div className="space-y-2">
					{approvals.map((approval) => (
						<a
							key={approval.id}
							href={`/accounting/approval-queue`}
							className="block p-3 hover:bg-gray-50 rounded border"
						>
							<p className="font-medium">{approval.actionName}</p>
							<p className="text-sm text-gray-600">{approval.entityName}</p>
						</a>
					))}
				</div>
			) : (
				<div className="text-center text-gray-500 py-8">
					<Lock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
					<p>No pending approvals</p>
				</div>
			)}
		</Card>
	);
};

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
							<p className="text-3xl font-bold">
								{stats?.glAccountsCount || 0}
							</p>
						</div>
						<BookOpen className="h-12 w-12 text-blue-500" />
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Journal Entries (Today)</p>
							<p className="text-3xl font-bold">
								{stats?.journalEntriesToday || 0}
							</p>
						</div>
						<FileText className="h-12 w-12 text-green-500" />
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Pending Approvals</p>
							<p className="text-3xl font-bold">
								{stats?.pendingApprovals || 0}
							</p>
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
				<RecentJournalEntriesCard entries={stats?.recentJournalEntries || []} />
				<PendingApprovalsCard approvals={stats?.pendingApprovalsList || []} />
			</div>
		</div>
	);
}
