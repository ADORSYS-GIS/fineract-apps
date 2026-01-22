import { Button } from "@fineract-apps/ui";
import { usePendingJournalEntryReview } from "@/routes/approval-queue/$auditId/usePendingJournalEntryReview";

export type PendingJournalEntryReviewViewProps = ReturnType<
	typeof usePendingJournalEntryReview
>;

export const PendingJournalEntryReviewView = (
	props: PendingJournalEntryReviewViewProps,
) => {
	const {
		isLoading,
		pendingEntry,
		onBack,
		onApprove,
		onReject,
		commandAsJson,
	} = props;

	if (isLoading) {
		return <div className="p-4">Loading...</div>;
	}

	if (!pendingEntry) {
		return <div className="p-4">Entry not found.</div>;
	}

	return (
		<div className="p-4 sm:p-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
				<div className="order-1 sm:order-2">
					<Button onClick={onBack}>Back to Queue</Button>
				</div>
				<h1 className="text-2xl font-bold text-center sm:text-left order-2 sm:order-1">
					Review Journal Entry
				</h1>
			</div>

			<div className="bg-white rounded-lg shadow p-6 mb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
					<DetailRow label="Maker" value={pendingEntry.maker} />
					<DetailRow
						label="Made On"
						value={new Date(pendingEntry.madeOnDate).toLocaleDateString()}
					/>
					<DetailRow label="Action" value={pendingEntry.actionName} />
					<DetailRow label="Entity" value={pendingEntry.entityName} />
				</div>
			</div>

			<div className="bg-white rounded-lg shadow p-6 mb-6">
				<h3 className="text-lg font-semibold mb-4">Command Details</h3>
				<pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
					{JSON.stringify(commandAsJson, null, 2)}
				</pre>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<h3 className="text-lg font-semibold mb-4">Decision</h3>
				<div className="flex flex-col sm:flex-row gap-4">
					<Button
						onClick={onApprove}
						className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
					>
						Approve
					</Button>
					<Button
						onClick={onReject}
						className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
					>
						Reject
					</Button>
				</div>
			</div>
		</div>
	);
};

const DetailRow = ({
	label,
	value,
}: {
	label: string;
	value?: string | number | Date;
}) => (
	<div>
		<p className="text-sm text-gray-600">{label}</p>
		<p className="font-medium">{String(value)}</p>
	</div>
);
