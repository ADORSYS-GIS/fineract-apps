import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/Toast";
import { resetUserPassword } from "@/services/userSyncApi";

export const usePasswordReset = (
	username: string,
	onResetSuccess: () => void,
) => {
	const toast = useToast();

	const resetPasswordMutation = useMutation({
		mutationFn: () => resetUserPassword(username),
		onSuccess: (data) => {
			if (data.status === "success") {
				toast.success(
					data.message || `Password reset email sent to ${username}.`,
				);
				onResetSuccess();
			} else {
				toast.error(data.message || "An unknown error occurred.");
			}
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to send password reset email.");
		},
	});

	const onConfirmReset = () => {
		resetPasswordMutation.mutate();
	};

	return {
		onConfirmReset,
		isResettingPassword: resetPasswordMutation.isPending,
		resetError: resetPasswordMutation.error,
	};
};
