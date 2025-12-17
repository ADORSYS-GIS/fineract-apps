import { type GetV1MakercheckersResponse } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { DataTable, FiltersBar, PageHeader } from "../../components";

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
}

export function ApprovalQueueView({
	pendingEntries,
	isLoading,
	isProcessing,
	dateRange,
	onDateRangeChange,
}: ApprovalQueueViewProps) {
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
				<div className="flex justify-end">
					<Link
						to="/approval-queue/$auditId"
						params={{
							// @ts-expect-error id is not in the type but it exists
							auditId: entry.id,
						}}
					>
						<Button>Review</Button>
					</Link>
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
		</div>
	);
}
