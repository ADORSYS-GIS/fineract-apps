import { PasswordResetModalView } from "./PasswordResetModal.view";
import { usePasswordReset } from "./usePasswordReset";

interface PasswordResetModalContainerProps {
	isOpen: boolean;
	onClose: () => void;
	userName: string;
	userEmail?: string;
}

export function PasswordResetModal({
	isOpen,
	onClose,
	userName,
	userEmail,
}: PasswordResetModalContainerProps) {
	const { onConfirmReset, isResettingPassword, resetError } = usePasswordReset(
		userName,
		onClose,
	);

	return (
		<PasswordResetModalView
			isOpen={isOpen}
			onClose={onClose}
			onConfirm={onConfirmReset}
			userName={userName}
			userEmail={userEmail}
			isLoading={isResettingPassword}
			error={resetError?.message || null}
		/>
	);
}
