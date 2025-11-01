import { Button, Card } from "@fineract-apps/ui";
import { format } from "date-fns";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "@/components/Table";
import { LoanRepaymentSchedule } from "../CreateLoanAccount.types";

interface RepaymentScheduleStepProps {
	repaymentSchedule: LoanRepaymentSchedule | null;
	isCalculatingSchedule: boolean;
	handleCalculateSchedule: () => void;
}

export const RepaymentScheduleStepView: FC<RepaymentScheduleStepProps> = ({
	repaymentSchedule,
	isCalculatingSchedule,
	handleCalculateSchedule,
}) => {
	const { t } = useTranslation();

	const columns = useMemo(
		() => [
			{ header: "#", accessorKey: "period" },
			{ header: t("days", "Days"), accessorKey: "daysInPeriod" },
			{ header: t("date", "Date"), accessorKey: "dueDate" },
			{
				header: t("principalDue", "Principal Due"),
				accessorKey: "principalDue",
			},
			{ header: t("interest", "Interest"), accessorKey: "interestDue" },
			{ header: t("fees", "Fees"), accessorKey: "feeChargesDue" },
			{ header: t("penalties", "Penalties"), accessorKey: "penaltyChargesDue" },
			{ header: t("due", "Due"), accessorKey: "totalDueForPeriod" },
			{
				header: t("outstanding", "Outstanding"),
				accessorKey: "totalOutstandingForPeriod",
			},
		],
		[t],
	);

	const data = useMemo(
		() =>
			repaymentSchedule?.periods.map((period) => {
				const { dueDate } = period;
				const formattedDate =
					Array.isArray(dueDate) && dueDate.length >= 3
						? format(
								new Date(dueDate[0], dueDate[1] - 1, dueDate[2]),
								"dd MMMM yyyy",
							)
						: "-";

				return {
					...period,
					dueDate: formattedDate,
				};
			}) || [],
		[repaymentSchedule],
	);

	return (
		<Card>
			<div className="p-4">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
					<h2 className="text-lg font-semibold">
						{t("repaymentSchedule", "Repayment Schedule")}
					</h2>
					<div className="mt-2 sm:mt-0">
						<Button
							onClick={handleCalculateSchedule}
							disabled={isCalculatingSchedule}
							className="w-full"
						>
							{isCalculatingSchedule
								? t("calculating", "Calculating...")
								: t("calculateSchedule", "Calculate Schedule")}
						</Button>
					</div>
				</div>
				{isCalculatingSchedule ? (
					<div>{t("loading", "Loading...")}</div>
				) : (
					<div className="overflow-x-auto">
						<Table columns={columns} data={data} />
					</div>
				)}
			</div>
		</Card>
	);
};
