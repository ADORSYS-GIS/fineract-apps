import { CreateClosureView } from "./CreateClosureView";
import { useCreateClosure } from "./useCreateClosure";

export function CreateClosureContainer() {
	const { formData, errors, isSubmitting, onFormChange, onSubmit, onCancel } =
		useCreateClosure();

	return (
		<CreateClosureView
			formData={formData}
			errors={errors}
			isSubmitting={isSubmitting}
			onFormChange={onFormChange}
			onSubmit={onSubmit}
			onCancel={onCancel}
		/>
	);
}
