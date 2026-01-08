import { Button } from "@fineract-apps/ui";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export function ConfirmationModal({
	isOpen,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	onCancel,
	isLoading = false,
}: ConfirmationModalProps) {
	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				className="fixed inset-0 z-40 bg-black/40"
				onClick={onCancel}
				onKeyDown={(e) => e.key === "Escape" && onCancel()}
				aria-label="Close modal"
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<dialog
					className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6"
					open={isOpen}
					onClose={onCancel}
				>
					<button
						type="button"
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
						onClick={onCancel}
					>
						<X className="w-6 h-6" />
					</button>
					<div className="flex items-center gap-3 mb-4">
						<div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
							<AlertTriangle className="w-5 h-5 text-yellow-600" />
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
						</div>
					</div>

					<p className="text-gray-600 mb-6">{message}</p>

					<div className="flex justify-end gap-3">
						<Button variant="outline" onClick={onCancel} disabled={isLoading}>
							{cancelText}
						</Button>
						<Button
							onClick={onConfirm}
							disabled={isLoading}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							{isLoading ? "Processing..." : confirmText}
						</Button>
					</div>
				</dialog>
			</div>
		</>
	);
}
