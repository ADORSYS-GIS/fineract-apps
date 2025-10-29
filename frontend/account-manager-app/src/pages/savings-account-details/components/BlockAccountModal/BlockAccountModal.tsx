import { CodeValueData } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { X } from "lucide-react";
import { FC, useState } from "react";

interface BlockAccountModalProps {
	isOpen: boolean;
	onClose: () => void;
	blockReasons: CodeValueData[] | undefined;
	onConfirm: (reasonId: number) => void;
}

export const BlockAccountModal: FC<BlockAccountModalProps> = ({
	isOpen,
	onClose,
	blockReasons,
	onConfirm,
}) => {
	const [selectedReason, setSelectedReason] = useState<number | null>(null);

	if (!isOpen) {
		return null;
	}

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-40 bg-black/40"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				role="button"
				tabIndex={0}
				aria-label="Close modal"
			/>

			{/* Modal */}
			<div
				className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				role="button"
				tabIndex={0}
				aria-label="Close modal"
			>
				<div
					className="relative bg-white rounded-t-2xl md:rounded-lg p-6 w-full max-w-md shadow-lg"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					role="dialog"
					aria-modal="true"
				>
					<button
						type="button"
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hidden md:block"
						onClick={onClose}
					>
						<X className="w-6 h-6" />
					</button>
					<div className="hidden md:block">
						<h2 className="text-xl font-bold text-center mb-6">
							Block Account
						</h2>
					</div>
					<div className="md:hidden flex justify-center mb-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>
					<div className="md:hidden">
						<h2 className="text-xl font-bold text-center mb-6">
							Block Account
						</h2>
					</div>
					<p className="text-sm text-gray-600 mb-4">
						Please select a reason for blocking this account.
					</p>
					<select
						onChange={(e) => setSelectedReason(Number(e.target.value))}
						className="border rounded p-2 w-full mb-4"
					>
						<option value="">Select a reason</option>
						{blockReasons?.map((reason) => (
							<option key={reason.id} value={reason.id}>
								{reason.name}
							</option>
						))}
					</select>
					<div className="flex justify-end gap-4">
						<Button variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button
							onClick={() => {
								if (selectedReason) {
									onConfirm(selectedReason);
								}
							}}
							disabled={!selectedReason}
						>
							Confirm
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
