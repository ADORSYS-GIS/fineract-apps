import { CreateGLAccountView } from "./CreateGLAccountView";
import { useCreateGLAccount } from "./useCreateGLAccount";

export function CreateGLAccountContainer() {
	const { formData, errors, isSubmitting, onFormChange, onSubmit, onCancel } =
		useCreateGLAccount();

	return (
		<CreateGLAccountView
			formData={formData}
			errors={errors}
			isSubmitting={isSubmitting}
			onFormChange={onFormChange}
			onSubmit={onSubmit}
			onCancel={onCancel}
		/>
	);
}
