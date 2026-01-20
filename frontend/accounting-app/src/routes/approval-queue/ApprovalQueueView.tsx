import { type GetV1MakercheckersResponse } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
	const columns = [
		{
			key: "madeOnDate",
			header: t("madeOn"),
			className: "min-w-[140px]",
			render: (value: unknown) =>
				value ? format(new Date(value as string), "dd MMM yyyy, h:mm a") : "-",
		},
		{
			key: "maker",
			header: t("maker"),
			className: "min-w-[120px] hidden md:table-cell",
		},
		{
			key: "actionName",
			header: t("action"),
			className: "min-w-[100px]",
		},
		{
			key: "entityName",
			header: t("entity"),
			className: "min-w-[100px] hidden sm:table-cell",
		},
		{
			key: "actions",
			header: t("actions"),
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
						<Button>{t("review")}</Button>
					</Link>
				</div>
			),
		},
	];

	return (
		<div className="p-6">
			<PageHeader
				title={t("approvalQueue")}
				subtitle={t("reviewAndApprovePendingJournalEntries")}
			/>

			<div className="mb-6">
				<FiltersBar
					filters={[
						{
							key: "fromDate",
							label: t("fromDate"),
							type: "date",
							value: dateRange.from,
							onChange: (value) =>
								onDateRangeChange({ ...dateRange, from: value }),
						},
						{
							key: "toDate",
							label: t("toDate"),
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
					emptyMessage={t("noPendingApprovalsFound")}
					className="min-w-full"
				/>
			</div>
		</div>
	);
}
