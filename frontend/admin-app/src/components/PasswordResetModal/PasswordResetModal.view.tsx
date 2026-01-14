import { Button } from "@fineract-apps/ui";
import { AlertCircle, Mail, X } from "lucide-react";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
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
							{t("passwordReset.title")}
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
							{t("passwordReset.confirmMessage")}
						</p>

						<div className="p-4 bg-gray-50 rounded-lg space-y-2">
							<div>
								<span className="text-xs font-medium text-gray-500">
									{t("passwordReset.usernameLabel")}
								</span>
								<p className="text-sm font-medium text-gray-900">{userName}</p>
							</div>
							{userEmail && (
								<div>
									<span className="text-xs font-medium text-gray-500">
										{t("passwordReset.emailLabel")}
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
								{t("passwordReset.infoMessage")}
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
						{t("passwordReset.cancel")}
					</Button>
					<Button
						onClick={onConfirm}
						variant="default"
						size="default"
						disabled={isLoading}
					>
						{isLoading
							? t("passwordReset.sending")
							: t("passwordReset.sendResetEmail")}
					</Button>
				</div>
			</div>
		</div>
	);
}
