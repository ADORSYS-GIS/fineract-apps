import { Input } from "@fineract-apps/ui";
import { useFormikContext } from "formik";
import { ComponentProps } from "react";
import { LoanDetailsFormValues } from "../create-loan-account/CreateLoanAccount.schema";

type InputProps = ComponentProps<typeof Input>;

export const CurrencyInput = (props: InputProps) => {
	const { values } = useFormikContext<LoanDetailsFormValues>();

	return (
		<div className="relative">
			<Input {...props} />
			<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
				<span className="text-gray-500 sm:text-sm">{values.currencyCode}</span>
			</div>
		</div>
	);
};
