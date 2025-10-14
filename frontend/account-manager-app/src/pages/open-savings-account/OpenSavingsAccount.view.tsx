import { Form, Input, SubmitButton } from "@fineract-apps/ui";
import { Formik } from "formik";
import { FC } from "react";
import { z } from "zod";
import { openSavingsAccountValidationSchema } from "./OpenSavingsAccount.types";

type OpenSavingsAccountForm = z.infer<
	typeof openSavingsAccountValidationSchema
>;

interface OpenSavingsAccountViewProps {
	initialValues: OpenSavingsAccountForm;
	validationSchema: typeof openSavingsAccountValidationSchema;
	onSubmit: (values: OpenSavingsAccountForm) => void;
}

export const OpenSavingsAccountView: FC<OpenSavingsAccountViewProps> = ({
	initialValues,
	validationSchema,
	onSubmit,
}) => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center">
					Open New Savings Account
				</h1>
				<p className="text-center text-gray-600">
					Fill in the details below to open a new savings account for a client.
				</p>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={onSubmit}
				>
					<Form>
						<div className="space-y-4">
							<Input
								name="productId"
								label="Select Savings Product"
								type="select"
								options={[{ label: "Choose a product", value: "" }]}
							/>
							<Input
								name="submittedOnDate"
								label="Submitted On Date"
								type="date"
							/>
						</div>
						<div className="flex justify-end mt-8">
							<SubmitButton label="Submit for Approval" />
						</div>
					</Form>
				</Formik>
			</div>
		</div>
	);
};
