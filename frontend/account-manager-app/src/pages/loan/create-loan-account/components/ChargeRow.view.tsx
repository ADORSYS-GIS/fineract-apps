import { Button, Input } from "@fineract-apps/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { CurrencyInput } from "../../common/CurrencyInput";
import { LoanDetailsTemplate } from "../CreateLoanAccount.types";

interface ChargeRowProps {
	charge: NonNullable<LoanDetailsTemplate["chargeOptions"]>[number];
	index: number;
	onDelete: (index: number) => void;
}

export const ChargeRow: FC<ChargeRowProps> = ({ charge, index, onDelete }) => {
	const { t } = useTranslation();

	return (
		<div className="border rounded-lg p-4 mb-4 md:border-none md:p-0 md:mb-0 md:grid md:grid-cols-5 md:gap-4 hover:bg-gray-50 items-center">
			{/* Mobile view: Card layout */}
			<div className="md:hidden">
				<div className="font-semibold mb-2">{charge.name}</div>
				<div className="grid grid-cols-3 gap-2 text-sm">
					<div className="text-gray-500">{t("type", "Type")}</div>
					<div className="col-span-2">
						{charge.chargeCalculationType?.value}
					</div>
					<div className="text-gray-500">{t("amount", "Amount")}</div>
					<div className="col-span-2">
						{charge.chargeCalculationType?.value === "Flat" ? (
							<CurrencyInput
								name={`charges.${index}.amount`}
								type="number"
								disabled={charge.chargeCalculationType?.value !== "Flat"}
							/>
						) : (
							<div className="relative">
								<Input name={`charges.${index}.amount`} type="number" />
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
									<span className="text-gray-500 sm:text-sm">%</span>
								</div>
							</div>
						)}
					</div>
					<div className="text-gray-500">
						{t("collectedOn", "Collected On")}
					</div>
					<div className="col-span-2">{charge.chargeTimeType?.value}</div>
				</div>
				<div className="mt-4 flex justify-end gap-2">
					<Button
						variant="ghost"
						onClick={() => {
							/* Edit */
						}}
					>
						{t("edit", "Edit")}
					</Button>
					<Button
						variant="ghost"
						onClick={() => onDelete(index)}
						className="text-red-500"
					>
						{t("delete", "Delete")}
					</Button>
				</div>
			</div>

			{/* Desktop view: Grid layout */}
			<div className="hidden md:block px-2 py-2">{charge.name}</div>
			<div className="hidden md:block px-2 py-2">
				{charge.chargeCalculationType?.value}
			</div>
			<div className="hidden md:block px-2 py-2">
				{charge.chargeCalculationType?.value === "Flat" ? (
					<CurrencyInput
						name={`charges.${index}.amount`}
						type="number"
						disabled={
							!charge.chargeCalculationType?.value?.includes("Amount") &&
							charge.chargeCalculationType?.value !== "Flat"
						}
					/>
				) : (
					<div className="relative">
						<Input
							name={`charges.${index}.amount`}
							type="number"
							disabled={
								!charge.chargeCalculationType?.value?.includes("Amount") &&
								charge.chargeCalculationType?.value !== "Flat"
							}
						/>
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<span className="text-gray-500 sm:text-sm">%</span>
						</div>
					</div>
				)}
			</div>
			<div className="hidden md:block px-2 py-2">
				{charge.chargeTimeType?.value}
			</div>
			<div className="hidden md:flex justify-end gap-2">
				<Button
					variant="ghost"
					onClick={() => {
						/* Edit */
					}}
				>
					{t("edit", "Edit")}
				</Button>
				<Button
					variant="ghost"
					onClick={() => onDelete(index)}
					className="text-red-500"
				>
					{t("delete", "Delete")}
				</Button>
			</div>
		</div>
	);
};
