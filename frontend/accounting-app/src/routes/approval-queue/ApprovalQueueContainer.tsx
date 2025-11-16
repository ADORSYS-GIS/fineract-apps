import { usePermissions } from "../../hooks/usePermissions";
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

	const { canApproveEntries, canRejectEntries } = usePermissions();

	return (
		<ApprovalQueueView
			pendingApprovals={pendingApprovals}
			isLoading={isLoading}
			canApprove={canApproveEntries}
			canReject={canRejectEntries}
			onApprove={onApprove}
			onReject={onReject}
			isApproving={isApproving}
			isRejecting={isRejecting}
		/>
	);
}
