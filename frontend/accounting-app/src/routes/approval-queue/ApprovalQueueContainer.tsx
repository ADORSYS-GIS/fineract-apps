import { ApprovalQueueView } from "./ApprovalQueueView";
import { useApprovalQueue } from "./useApprovalQueue";

export function ApprovalQueueContainer() {
	const {
		pendingEntries,
		isLoading,
		isProcessing,
		dateRange,
		onDateRangeChange,
		onApprove,
		onReject,
		onDelete,
	} = useApprovalQueue();

	return (
		<ApprovalQueueView
			pendingEntries={pendingEntries}
			isLoading={isLoading}
			isProcessing={isProcessing}
			dateRange={dateRange}
			onDateRangeChange={onDateRangeChange}
			onApprove={onApprove}
			onReject={onReject}
			onDelete={onDelete}
		/>
	);
}
