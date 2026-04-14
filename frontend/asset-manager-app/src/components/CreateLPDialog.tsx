import { Button } from "@fineract-apps/ui";
import { type FC, useEffect, useRef, useState } from "react";

interface CreateLPDialogProps {
	isOpen: boolean;
	isCreating: boolean;
	onSubmit: (fullname: string) => void;
	onCancel: () => void;
}

export const CreateLPDialog: FC<CreateLPDialogProps> = ({
	isOpen,
	isCreating,
	onSubmit,
	onCancel,
}) => {
	const [fullname, setFullname] = useState("");
	const cancelRef = useRef<HTMLButtonElement>(null);
	const isCreatingRef = useRef(isCreating);

	useEffect(() => {
		isCreatingRef.current = isCreating;
	}, [isCreating]);

	useEffect(() => {
		if (!isOpen) return;
		setFullname("");
		cancelRef.current?.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isCreatingRef.current) {
				onCancel();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onCancel]);

	if (!isOpen) return null;

	const isValid = fullname.trim().length > 0;

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			role="dialog"
			aria-modal="true"
			aria-labelledby="create-lp-dialog-title"
			onClick={(e) => {
				if (e.target === e.currentTarget && !isCreating) onCancel();
			}}
		>
			<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
				<h3
					id="create-lp-dialog-title"
					className="text-lg font-semibold text-gray-900 mb-1"
				>
					Create Liquidity Partner
				</h3>
				<p className="text-sm text-gray-500 mb-4">
					A new company client will be created in Fineract and automatically
					selected as the LP for this asset.
				</p>

				<div className="mb-6">
					<label
						htmlFor="lp-fullname"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Company Name <span className="text-red-500">*</span>
					</label>
					<input
						id="lp-fullname"
						type="text"
						autoFocus
						value={fullname}
						onChange={(e) => setFullname(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && isValid && !isCreating) {
								onSubmit(fullname.trim());
							}
						}}
						placeholder="e.g. Acme Capital SA"
						disabled={isCreating}
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
					/>
				</div>

				<div className="flex justify-end gap-3">
					<Button
						ref={cancelRef}
						variant="outline"
						onClick={onCancel}
						disabled={isCreating}
					>
						Cancel
					</Button>
					<Button
						onClick={() => isValid && onSubmit(fullname.trim())}
						disabled={!isValid || isCreating}
					>
						{isCreating ? "Creating..." : "Create LP"}
					</Button>
				</div>
			</div>
		</div>
	);
};
