import { Button, Card } from "@fineract-apps/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { LoanRepaymentSchedule } from "../CreateLoanAccount.types";
import { RepaymentRow } from "./RepaymentRow.view";

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
					<div>
						<div className="hidden md:grid md:grid-cols-9 md:gap-4 font-semibold text-gray-500 border-b pb-2 mb-2">
							<div className="px-2 py-2">#</div>
							<div className="px-2 py-2">{t("days", "Days")}</div>
							<div className="px-2 py-2">{t("date", "Date")}</div>
							<div className="px-2 py-2">
								{t("principalDue", "Principal Due")}
							</div>
							<div className="px-2 py-2">{t("interest", "Interest")}</div>
							<div className="px-2 py-2">{t("fees", "Fees")}</div>
							<div className="px-2 py-2">{t("penalties", "Penalties")}</div>
							<div className="px-2 py-2">{t("due", "Due")}</div>
							<div className="px-2 py-2">{t("outstanding", "Outstanding")}</div>
						</div>
						{repaymentSchedule?.periods.map((period) => (
							<RepaymentRow key={period.period} period={period} />
						))}
					</div>
				)}
			</div>
		</Card>
	);
};
