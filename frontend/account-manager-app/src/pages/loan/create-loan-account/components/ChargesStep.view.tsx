import { ChargeData } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { FieldArray, useFormikContext } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoanDetailsFormValues } from "../CreateLoanAccount.schema";
import { LoanDetailsTemplate } from "../CreateLoanAccount.types";
import { ChargeRow } from "./ChargeRow.view";

interface ChargesStepViewProps {
	isLoading: boolean;
	loanDetails: LoanDetailsTemplate;
}

export const ChargesStepView = ({
	isLoading,
	loanDetails,
}: ChargesStepViewProps) => {
	const { t } = useTranslation();
	const { values } = useFormikContext<LoanDetailsFormValues>();
	const [selectedChargeId, setSelectedChargeId] = useState<string>("");

	const handleAddCharge = (push: (obj: ChargeData) => void) => {
		const chargeToAdd = loanDetails.chargeOptions?.find(
			(charge) => charge.id === Number(selectedChargeId),
		);
		if (chargeToAdd) {
			push(chargeToAdd);
		}
	};

	return isLoading ? (
		<div>{t("loading", "Loading...")}</div>
	) : (
		<FieldArray
			name="charges"
			render={({ push, remove }) => (
				<div>
					<div className="flex flex-wrap sm:flex-nowrap items-end gap-4 mb-4">
						<div className="w-full sm:w-auto sm:flex-grow">
							<label
								htmlFor="charge"
								className="block text-sm font-medium text-gray-700"
							>
								{t("charge", "Charge")}
							</label>
							<select
								id="charge"
								value={selectedChargeId}
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
									setSelectedChargeId(e.target.value)
								}
								className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
							>
								<option value="">
									{t("selectACharge", "Select a charge")}
								</option>
								{loanDetails.chargeOptions?.map((charge) =>
									charge.id ? (
										<option key={charge.id} value={charge.id.toString()}>
											{charge.name}
										</option>
									) : null,
								)}
							</select>
						</div>
						<Button
							onClick={() => handleAddCharge(push)}
							disabled={!selectedChargeId}
							className="w-full sm:w-auto"
						>
							{t("add", "Add")}
						</Button>
					</div>
					<div>
						<div className="hidden md:grid md:grid-cols-5 md:gap-4 font-semibold text-gray-500 border-b pb-2 mb-2">
							<div className="px-2 py-2">{t("name", "Name")}</div>
							<div className="px-2 py-2">{t("type", "Type")}</div>
							<div className="px-2 py-2">{t("amount", "Amount")}</div>
							<div className="px-2 py-2">
								{t("collectedOn", "Collected On")}
							</div>
							<div className="px-2 py-2 text-right">
								{t("actions", "Actions")}
							</div>
						</div>
						{values.charges?.map((charge, index) => (
							<ChargeRow
								key={charge.id}
								charge={charge}
								index={index}
								onDelete={() => remove(index)}
							/>
						))}
					</div>
				</div>
			)}
		/>
	);
};
