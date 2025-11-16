import { Button, Card } from "@fineract-apps/ui";
import { Check, Clock, X } from "lucide-react";
import type { PendingApproval } from "./useApprovalQueue";

interface ApprovalQueueViewProps {
	pendingApprovals: PendingApproval[];
	isLoading: boolean;
	onApprove: (auditId: number) => void;
	onReject: (auditId: number) => void;
	isApproving: number | null;
	isRejecting: number | null;
}

export function ApprovalQueueView({
	pendingApprovals,
	isLoading,
	onApprove,
	onReject,
	isApproving,
	isRejecting,
}: ApprovalQueueViewProps) {
	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold">Approval Queue</h1>
					<p className="text-gray-600 mt-1">
						Review and approve pending accounting entries
					</p>
				</div>
				<div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
					<Clock className="h-5 w-5 text-blue-600" />
					<span className="text-sm font-medium text-blue-900">
						{pendingApprovals.length} Pending
					</span>
				</div>
			</div>

			{isLoading ? (
				<Card className="p-6">
					<div className="animate-pulse space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="h-24 bg-gray-200 rounded" />
						))}
					</div>
				</Card>
			) : pendingApprovals.length === 0 ? (
				<Card className="p-12 text-center">
					<Check className="h-16 w-16 mx-auto mb-4 text-green-500" />
					<h3 className="text-lg font-semibold mb-2">All caught up!</h3>
					<p className="text-gray-600">
						There are no pending approvals at this time.
					</p>
				</Card>
			) : (
				<div className="space-y-4">
					{pendingApprovals.map((approval) => (
						<Card key={approval.id} className="p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<h3 className="text-lg font-semibold">
											{approval.actionName}
										</h3>
										<span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
											Pending Approval
										</span>
									</div>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
										<div>
											<span className="text-gray-600">Entity:</span>
											<p className="font-medium">{approval.entityName}</p>
										</div>
										<div>
											<span className="text-gray-600">Resource ID:</span>
											<p className="font-medium">{approval.resourceId}</p>
										</div>
										<div>
											<span className="text-gray-600">Submitted by:</span>
											<p className="font-medium">{approval.maker}</p>
										</div>
										<div>
											<span className="text-gray-600">Submitted on:</span>
											<p className="font-medium">
												{new Date(approval.madeOnDate).toLocaleDateString()}
											</p>
										</div>
									</div>
									{approval.processingResult && (
										<div className="mt-3 p-3 bg-gray-50 rounded">
											<span className="text-sm text-gray-600">Details:</span>
											<p className="text-sm mt-1">
												{approval.processingResult}
											</p>
										</div>
									)}
								</div>
								<div className="flex gap-2 ml-4">
									<Button
										onClick={() => onApprove(approval.id)}
										disabled={
											isApproving === approval.id || isRejecting === approval.id
										}
										className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
									>
										<Check className="h-4 w-4" />
										{isApproving === approval.id ? "Approving..." : "Approve"}
									</Button>
									<Button
										onClick={() => onReject(approval.id)}
										disabled={
											isApproving === approval.id || isRejecting === approval.id
										}
										variant="outline"
										className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
									>
										<X className="h-4 w-4" />
										{isRejecting === approval.id ? "Rejecting..." : "Reject"}
									</Button>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
