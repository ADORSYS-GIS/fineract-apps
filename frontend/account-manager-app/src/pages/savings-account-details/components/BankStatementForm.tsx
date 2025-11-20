import {
	Card,
	Form,
	Input,
	SubmitButton,
	useFormContext,
} from "@fineract-apps/ui";
import { Field } from "formik";
import { FC } from "react";
import { z } from "zod";

const bankStatementFormSchema = z.object({
	outputType: z.string(),
	startDate: z.string().min(1, { message: "Start date is required" }),
	endDate: z.string().min(1, { message: "End date is required" }),
});

export type BankStatementFormSchema = z.infer<typeof bankStatementFormSchema>;

interface BankStatementFormProps {
	onSubmit: (data: BankStatementFormSchema) => void;
}

const BankStatementFormFields: FC = () => {
	const { errors, touched } = useFormContext<BankStatementFormSchema>();

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<label htmlFor="startDate">Start Date</label>
					<Field as={Input} id="startDate" type="date" name="startDate" />
					{errors.startDate && touched.startDate && (
						<p className="text-red-500 text-sm">{errors.startDate}</p>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="endDate">End Date</label>
					<Field as={Input} id="endDate" type="date" name="endDate" />
					{errors.endDate && touched.endDate && (
						<p className="text-red-500 text-sm">{errors.endDate}</p>
					)}
				</div>
				<div className="flex flex-col gap-2 md:col-span-2">
					<label htmlFor="outputType">Format</label>
					<Field
						as="select"
						id="outputType"
						name="outputType"
						className="border border-gray-300 rounded-md p-2"
					>
						<option value="PDF">PDF</option>
						<option value="XLS">XLS</option>
						<option value="CSV">CSV</option>
					</Field>
				</div>
			</div>
			<div className="flex justify-end mt-4">
				<SubmitButton label="Generate Report" />
			</div>
		</>
	);
};

export const BankStatementForm: FC<BankStatementFormProps> = ({ onSubmit }) => {
	return (
		<Card title="Bank Statement" className="w-full">
			<Form<BankStatementFormSchema>
				initialValues={{
					outputType: "PDF",
					startDate: "",
					endDate: "",
				}}
				onSubmit={onSubmit}
				className="p-4"
			>
				<BankStatementFormFields />
			</Form>
		</Card>
	);
};
