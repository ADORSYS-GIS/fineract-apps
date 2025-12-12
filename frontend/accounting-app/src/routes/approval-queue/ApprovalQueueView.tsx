import { type GetV1MakercheckersResponse } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { format } from "date-fns";
import { Check, ThumbsDown, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	ConfirmationModal,
	DataTable,
	FiltersBar,
	PageHeader,
} from "../../components";

interface DateRange {
	from: string;
	to: string;
}

interface ApprovalQueueViewProps {
	pendingEntries: GetV1MakercheckersResponse[] | undefined;
	isLoading: boolean;
	isProcessing: boolean;
	dateRange: DateRange;
	onDateRangeChange: (range: DateRange) => void;
	onApprove: (entry: GetV1MakercheckersResponse) => void;
	onReject: (entry: GetV1MakercheckersResponse) => void;
	onDelete: (entry: GetV1MakercheckersResponse) => void;
}

export function ApprovalQueueView({
	pendingEntries,
	isLoading,
	isProcessing,
	dateRange,
	onDateRangeChange,
	onApprove,
	onReject,
	onDelete,
}: ApprovalQueueViewProps) {
	const [confirmationModal, setConfirmationModal] = useState<{
		isOpen: boolean;
		title: string;
		message: string;
		confirmText: string;
		action: () => void;
	}>({
		isOpen: false,
		title: "",
		message: "",
		confirmText: "",
		action: () => {
			// Default empty action for initial state
		},
	});

	const openConfirmationModal = (
		title: string,
		message: string,
		confirmText: string,
		action: () => void,
	) => {
		setConfirmationModal({
			isOpen: true,
			title,
			message,
			confirmText,
			action,
		});
	};

	const closeConfirmationModal = () => {
		setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
	};

	const handleConfirmAction = () => {
		confirmationModal.action();
		closeConfirmationModal();
	};

	const columns = [
		{
			key: "madeOnDate",
			header: "Made On",
			className: "min-w-[140px]",
			render: (value: unknown) =>
				value ? format(new Date(value as string), "dd MMM yyyy, h:mm a") : "-",
		},
		{
			key: "maker",
			header: "Maker",
			className: "min-w-[120px] hidden md:table-cell",
		},
		{
			key: "actionName",
			header: "Action",
			className: "min-w-[100px]",
		},
		{
			key: "entityName",
			header: "Entity",
			className: "min-w-[100px] hidden sm:table-cell",
		},
		{
			key: "actions",
			header: "Actions",
			className: "text-right min-w-[200px]",
			render: (_: unknown, entry: GetV1MakercheckersResponse) => (
				<div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2">
					<Button
						onClick={() =>
							openConfirmationModal(
								"Approve Entry",
								"Are you sure you want to approve this journal entry?",
								"Approve",
								() => onApprove(entry),
							)
						}
						disabled={isProcessing}
						size="sm"
						className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm"
					>
						<Check className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
						<span className="hidden sm:inline">Approve</span>
						<span className="sm:hidden">✓</span>
					</Button>
					<Button
						onClick={() =>
							openConfirmationModal(
								"Reject Entry",
								"Are you sure you want to reject this journal entry? This action cannot be undone.",
								"Reject",
								() => onReject(entry),
							)
						}
						disabled={isProcessing}
						size="sm"
						variant="outline"
						className="text-yellow-600 border-yellow-500 hover:bg-yellow-50 text-xs sm:text-sm"
					>
						<ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
						<span className="hidden sm:inline">Reject</span>
						<span className="sm:hidden">✗</span>
					</Button>
					<Button
						onClick={() =>
							openConfirmationModal(
								"Delete Entry",
								"Are you sure you want to delete this pending entry? This will remove it from the queue entirely.",
								"Delete",
								() => onDelete(entry),
							)
						}
						disabled={isProcessing}
						size="sm"
						variant="destructive"
						className="text-xs sm:text-sm"
					>
						<Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
						<span className="hidden sm:inline">Delete</span>
						<span className="sm:hidden">🗑️</span>
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="p-6">
			<PageHeader
				title="Approval Queue"
				subtitle="Review and approve pending journal entries."
			/>

			<div className="mb-6">
				<FiltersBar
					filters={[
						{
							key: "fromDate",
							label: "From Date",
							type: "date",
							value: dateRange.from,
							onChange: (value) =>
								onDateRangeChange({ ...dateRange, from: value }),
						},
						{
							key: "toDate",
							label: "To Date",
							type: "date",
							value: dateRange.to,
							onChange: (value) =>
								onDateRangeChange({ ...dateRange, to: value }),
						},
					]}
				/>
			</div>

			<div className="overflow-x-auto">
				<DataTable
					data={pendingEntries || []}
					columns={columns}
					isLoading={isLoading}
					emptyMessage="No pending approvals found."
					className="min-w-full"
				/>
			</div>

			<ConfirmationModal
				isOpen={confirmationModal.isOpen}
				title={confirmationModal.title}
				message={confirmationModal.message}
				confirmText={confirmationModal.confirmText}
				onConfirm={handleConfirmAction}
				onCancel={closeConfirmationModal}
				isLoading={isProcessing}
			/>
		</div>
	);
}
