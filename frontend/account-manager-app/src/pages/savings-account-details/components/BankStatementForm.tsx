import {
	Card,
	Form,
	Input,
	SubmitButton,
	useFormContext,
} from "@fineract-apps/ui";
import { Field } from "formik";
import { FC } from "react";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
	const { errors, touched } = useFormContext<BankStatementFormSchema>();

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<label htmlFor="startDate">{t("bankStatementForm.startDate")}</label>
					<Field as={Input} id="startDate" type="date" name="startDate" />
					{errors.startDate && touched.startDate && (
						<p className="text-red-500 text-sm">{errors.startDate}</p>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="endDate">{t("bankStatementForm.endDate")}</label>
					<Field as={Input} id="endDate" type="date" name="endDate" />
					{errors.endDate && touched.endDate && (
						<p className="text-red-500 text-sm">{errors.endDate}</p>
					)}
				</div>
				<div className="flex flex-col gap-2 md:col-span-2">
					<label htmlFor="outputType">{t("bankStatementForm.format")}</label>
					<Field
						as="select"
						id="outputType"
						name="outputType"
						className="border border-gray-300 rounded-md p-2"
					>
						<option value="PDF">{t("accountManagerCommon.pdf")}</option>
						<option value="XLS">{t("accountManagerCommon.xls")}</option>
						<option value="CSV">{t("accountManagerCommon.csv")}</option>
					</Field>
				</div>
			</div>
			<div className="flex justify-end mt-4">
				<SubmitButton label={t("bankStatementForm.generateReport")} />
			</div>
		</>
	);
};

export const BankStatementForm: FC<BankStatementFormProps> = ({ onSubmit }) => {
	const { t } = useTranslation();
	return (
		<Card title={t("bankStatementForm.bankStatement")} className="w-full">
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
