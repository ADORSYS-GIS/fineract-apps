import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import {
	getTellerCreateSchema,
	type TellerCreateFormValues,
} from "./TellerCreate.types";
import { TellerCreateView } from "./TellerCreate.view";
import { useTellerCreate } from "./useTellerCreate";

export function TellerCreate() {
	const { t } = useTranslation();
	const { initialValues, onSubmit, isSubmitting } = useTellerCreate();

	const handleSubmit = async (values: TellerCreateFormValues) => {
		try {
			const tellerCreateSchema = getTellerCreateSchema(t);
			tellerCreateSchema.parse(values);
			onSubmit(values);
		} catch (err) {
			if (err instanceof ZodError) {
				toast.error(
					t("tellerCreate.validationError", { message: err.issues[0].message }),
				);
			}
		}
	};

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			{/* No back button on create form; Cancel is provided in the form */}
			<TellerCreateView
				initialValues={initialValues}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}
