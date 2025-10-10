import { PageHeader } from "@/components/PageHeader";
import {
	type TellerCreateFormValues,
	tellerCreateSchema,
} from "./TellerCreate.types";
import { TellerCreateView } from "./TellerCreate.view";
import { useTellerCreate } from "./useTellerCreate";

export function TellerCreate() {
	const {
		initialValues,
		officeOptions,
		loadingOffices,
		onSubmit,
		isSubmitting,
	} = useTellerCreate();

	const handleSubmit = async (values: TellerCreateFormValues) => {
		tellerCreateSchema.parse(values);
		onSubmit(values);
	};

	return (
		<div>
			<PageHeader title="Create Teller" />
			<TellerCreateView
				initialValues={initialValues}
				officeOptions={officeOptions}
				loadingOffices={loadingOffices}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}
