import { ApprovalQueueView } from "./ApprovalQueueView";
import { useApprovalQueue } from "./useApprovalQueue";

export function ApprovalQueueContainer() {
	const {
		pendingApprovals,
		isLoading,
		onApprove,
		onReject,
		isApproving,
		isRejecting,
	} = useApprovalQueue();

	return (
		<ApprovalQueueView
			pendingApprovals={pendingApprovals}
			isLoading={isLoading}
			onApprove={onApprove}
			onReject={onReject}
			isApproving={isApproving}
			isRejecting={isRejecting}
		/>
	);
}
