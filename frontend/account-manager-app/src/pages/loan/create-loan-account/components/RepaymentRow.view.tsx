import { format } from "date-fns";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LoanRepaymentSchedule } from "../CreateLoanAccount.types";

interface RepaymentRowProps {
	period: LoanRepaymentSchedule["periods"][number];
}

export const RepaymentRow: FC<RepaymentRowProps> = ({ period }) => {
	const { t } = useTranslation();
	const { dueDate } = period;

	const formattedDate = useMemo(
		() =>
			Array.isArray(dueDate) && dueDate.length >= 3
				? format(
						new Date(dueDate[0], dueDate[1] - 1, dueDate[2]),
						"dd MMMM yyyy",
					)
				: "-",
		[dueDate],
	);

	return (
		<div className="border rounded-lg p-4 mb-4 md:border-none md:p-0 md:mb-0 md:grid md:grid-cols-9 md:gap-4 hover:bg-gray-50">
			<div className="md:hidden font-semibold mb-2">
				{t("period", "Period")} #{period.period}
			</div>
			<div className="hidden md:block md:px-2 md:py-2">{period.period}</div>
			<div className="grid grid-cols-2 gap-2 md:block md:px-2 md:py-2">
				<div className="text-gray-500 md:hidden">{t("days", "Days")}</div>
				<div>{period.daysInPeriod}</div>
			</div>
			<div className="grid grid-cols-2 gap-2 md:block md:px-2 md:py-2">
				<div className="text-gray-500 md:hidden">{t("date", "Date")}</div>
				<div>{formattedDate}</div>
			</div>
			<div className="grid grid-cols-2 gap-2 md:block md:px-2 md:py-2">
				<div className="text-gray-500 md:hidden">
					{t("principalDue", "Principal Due")}
				</div>
				<div>{period.principalDue}</div>
			</div>
			<div className="grid grid-cols-2 gap-2 md:block md:px-2 md:py-2">
				<div className="text-gray-500 md:hidden">
					{t("interest", "Interest")}
				</div>
				<div>{period.interestDue}</div>
			</div>
			<div className="grid grid-cols-2 gap-2 md:block md:px-2 md:py-2">
				<div className="text-gray-500 md:hidden">{t("fees", "Fees")}</div>
				<div>{period.feeChargesDue}</div>
			</div>
			<div className="grid grid-cols-2 gap-2 md:block md:px-2 md:py-2">
				<div className="text-gray-500 md:hidden">
					{t("penalties", "Penalties")}
				</div>
				<div>{period.penaltyChargesDue}</div>
			</div>
			<div className="grid grid-cols-2 gap-2 md:block md:px-2 md:py-2">
				<div className="text-gray-500 md:hidden">{t("due", "Due")}</div>
				<div>{period.totalDueForPeriod}</div>
			</div>
			<div className="grid grid-cols-2 gap-2 md:block md:px-2 md:py-2">
				<div className="text-gray-500 md:hidden">
					{t("outstanding", "Outstanding")}
				</div>
				<div>{period.totalOutstandingForPeriod}</div>
			</div>
		</div>
	);
};
