import { PageHeader } from "@/components/PageHeader";
import {
	type TellerCreateFormValues,
	tellerCreateSchema,
} from "./TellerCreate.types";
import { TellerCreateView } from "./TellerCreate.view";
import { useTellerCreate } from "./useTellerCreate";

export function TellerCreate() {
	const { initialValues, onSubmit, isSubmitting } = useTellerCreate();

	const handleSubmit = async (values: TellerCreateFormValues) => {
		tellerCreateSchema.parse(values);
		onSubmit(values);
	};

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			<PageHeader />
			<TellerCreateView
				initialValues={initialValues}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}
