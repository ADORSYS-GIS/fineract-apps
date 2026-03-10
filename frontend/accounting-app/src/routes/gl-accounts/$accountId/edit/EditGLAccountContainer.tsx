import { EditGLAccountView } from "./EditGLAccountView";
import { useEditGLAccount } from "./useEditGLAccount";

export function EditGLAccountContainer() {
	const {
		formData,
		errors,
		isLoading,
		isSubmitting,
		onFormChange,
		onSubmit,
		onCancel,
	} = useEditGLAccount();

	return (
		<EditGLAccountView
			formData={formData}
			errors={errors}
			isLoading={isLoading}
			isSubmitting={isSubmitting}
			onFormChange={onFormChange}
			onSubmit={onSubmit}
			onCancel={onCancel}
		/>
	);
}
