import { Button } from "@fineract-apps/ui";
import { type FC } from "react";

interface ConfirmDialogProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmLabel?: string;
	confirmClassName?: string;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
	isOpen,
	title,
	message,
	confirmLabel = "Confirm",
	confirmClassName,
	onConfirm,
	onCancel,
	isLoading,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
				<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
				<p className="text-sm text-gray-600 mb-6">{message}</p>
				<div className="flex justify-end gap-3">
					<Button variant="outline" onClick={onCancel} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={onConfirm}
						disabled={isLoading}
						className={confirmClassName}
					>
						{isLoading ? "Processing..." : confirmLabel}
					</Button>
				</div>
			</div>
		</div>
	);
};
