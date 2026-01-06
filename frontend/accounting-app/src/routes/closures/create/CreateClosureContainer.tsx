import { CreateClosureView } from "./CreateClosureView";
import { useCreateClosure } from "./useCreateClosure";

export function CreateClosureContainer() {
	const {
		formData,
		errors,
		offices,
		isLoadingOffices,
		isSubmitting,
		onFormChange,
		onSubmit,
		onCancel,
	} = useCreateClosure();

	return (
		<CreateClosureView
			formData={formData}
			errors={errors}
			offices={offices}
			isLoadingOffices={isLoadingOffices}
			isSubmitting={isSubmitting}
			onFormChange={onFormChange}
			onSubmit={onSubmit}
			onCancel={onCancel}
		/>
	);
}
