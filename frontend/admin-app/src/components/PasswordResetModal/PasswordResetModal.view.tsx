import { Button } from "@fineract-apps/ui";
import { AlertCircle, Mail, X } from "lucide-react";
import { PasswordResetModalProps } from "./PasswordResetModal.types";

export function PasswordResetModalView({
	isOpen,
	onClose,
	onConfirm,
	userName,
	userEmail,
	isLoading = false,
	error = null,
}: PasswordResetModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-xl m-4">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-50 rounded-lg">
							<Mail className="w-5 h-5 text-blue-600" />
						</div>
						<h2 className="text-lg font-semibold text-gray-800">
							Reset Password
						</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
						type="button"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6">
					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
							<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
							<p className="text-sm text-red-700">{error}</p>
						</div>
					)}

					<div className="space-y-4">
						<p className="text-sm text-gray-600">
							Are you sure you want to send a password reset email to:
						</p>

						<div className="p-4 bg-gray-50 rounded-lg space-y-2">
							<div>
								<span className="text-xs font-medium text-gray-500">
									Username
								</span>
								<p className="text-sm font-medium text-gray-900">{userName}</p>
							</div>
							{userEmail && (
								<div>
									<span className="text-xs font-medium text-gray-500">
										Email
									</span>
									<p className="text-sm font-medium text-gray-900">
										{userEmail}
									</p>
								</div>
							)}
						</div>

						<div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
							<AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
							<p className="text-xs text-blue-800">
								The user will receive an email with a secure link to reset their
								password. The link will expire after 24 hours.
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
					<Button
						onClick={onClose}
						variant="outline"
						size="default"
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={onConfirm}
						variant="default"
						size="default"
						disabled={isLoading}
					>
						{isLoading ? "Sending..." : "Send Reset Email"}
					</Button>
				</div>
			</div>
		</div>
	);
}
