import { toast } from "react-hot-toast";
import { ZodError } from "zod";
import {
	type TellerCreateFormValues,
	tellerCreateSchema,
} from "./TellerCreate.types";
import { TellerCreateView } from "./TellerCreate.view";
import { useTellerCreate } from "./useTellerCreate";

export function TellerCreate() {
	const { initialValues, onSubmit, isSubmitting } = useTellerCreate();

	const handleSubmit = async (values: TellerCreateFormValues) => {
		try {
			tellerCreateSchema.parse(values);
			onSubmit(values);
		} catch (err) {
			if (err instanceof ZodError) {
				toast.error(err.issues[0].message);
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
