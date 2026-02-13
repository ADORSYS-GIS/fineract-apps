import { Button } from "@fineract-apps/ui";
import { type FC, useEffect, useRef } from "react";

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
	const cancelRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!isOpen) return;
		cancelRef.current?.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isLoading) {
				onCancel();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, isLoading, onCancel]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-dialog-title"
			aria-describedby="confirm-dialog-message"
			onClick={(e) => {
				if (e.target === e.currentTarget && !isLoading) onCancel();
			}}
		>
			<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
				<h3
					id="confirm-dialog-title"
					className="text-lg font-semibold text-gray-900 mb-2"
				>
					{title}
				</h3>
				<p id="confirm-dialog-message" className="text-sm text-gray-600 mb-6">
					{message}
				</p>
				<div className="flex justify-end gap-3">
					<Button
						ref={cancelRef}
						variant="outline"
						onClick={onCancel}
						disabled={isLoading}
					>
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
