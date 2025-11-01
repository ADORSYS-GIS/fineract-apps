import { FieldArray, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { LoanDetailsFormValues } from "../CreateLoanAccount.schema";

interface ChargesStepViewProps {
	isLoading: boolean;
}

export const ChargesStepView = ({ isLoading }: ChargesStepViewProps) => {
	const { t } = useTranslation();
	const { values } = useFormikContext<LoanDetailsFormValues>();

	return isLoading ? (
		<div>{t("loading", "Loading...")}</div>
	) : (
		<FieldArray
			name="charges"
			render={() => (
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3">
									{t("name", "Name")}
								</th>
								<th scope="col" className="px-6 py-3">
									{t("type", "Type")}
								</th>
								<th scope="col" className="px-6 py-3">
									{t("amount", "Amount")}
								</th>
								<th scope="col" className="px-6 py-3">
									{t("collectedOn", "Collected On")}
								</th>
							</tr>
						</thead>
						<tbody>
							{values.charges?.map((charge) => (
								<tr key={charge.id} className="bg-white border-b">
									<td className="px-6 py-4">{charge.name}</td>
									<td className="px-6 py-4">
										{charge.chargeCalculationType?.value}
									</td>
									<td className="px-6 py-4">{charge.amount}</td>
									<td className="px-6 py-4">{charge.chargeTimeType?.value}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		/>
	);
};
