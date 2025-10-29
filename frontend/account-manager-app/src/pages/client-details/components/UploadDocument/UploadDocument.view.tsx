import { Button, Form, Input } from "@fineract-apps/ui";
import { X } from "lucide-react";
import { FC } from "react";
import { useUploadDocument } from "./useUploadDocument";

export const UploadDocument: FC<{
	isOpen: boolean;
	onClose: () => void;
	identityId: number;
}> = ({ isOpen, onClose, identityId }) => {
	const { initialValues, onSubmit, isPending } = useUploadDocument(
		identityId,
		onClose,
	);

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				className="fixed inset-0 z-40 bg-black/40"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				tabIndex={0}
				aria-label="Close modal"
			/>

			{/* Modal */}
			<button
				type="button"
				className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				tabIndex={0}
				aria-label="Close modal"
			>
				<dialog
					className="relative bg-white rounded-t-2xl md:rounded-lg p-6 w-full max-w-md shadow-lg"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
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
							Upload Document
						</h2>
					</div>
					<div className="md:hidden flex justify-center mb-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>
					<div className="md:hidden">
						<h2 className="text-xl font-bold text-center mb-6">
							Upload Document
						</h2>
					</div>
					<Form initialValues={initialValues} onSubmit={onSubmit}>
						<div className="space-y-4">
							<Input
								name="name"
								label="File Name"
								placeholder="Enter file name"
							/>
							<Input name="file" label="Browse" type="file" />
							<div className="flex justify-end space-x-4">
								<Button variant="secondary" onClick={onClose}>
									Cancel
								</Button>
								<Button type="submit" disabled={isPending}>
									{isPending ? "Uploading..." : "Confirm"}
								</Button>
							</div>
						</div>
					</Form>
				</dialog>
			</button>
		</>
	);
};
