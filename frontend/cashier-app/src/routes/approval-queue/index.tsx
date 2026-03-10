import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/approval-queue/")({
	component: ApprovalQueueIndex,
});

function ApprovalQueueIndex() {
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Approval Queue</h1>
			<p>List of items pending approval will appear here.</p>
		</div>
	);
}
