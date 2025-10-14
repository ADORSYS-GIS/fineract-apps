import { Button, Form, Input } from "@fineract-apps/ui";
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
			<div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

			{/* Bottom Sheet */}
			<div
				className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
				onClick={onClose}
			>
				<div
					className="bg-white rounded-t-2xl p-6 w-full max-w-md shadow-lg"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Drag handle */}
					<div className="flex justify-center mb-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>

					<h2 className="text-xl font-bold text-center mb-6">
						Upload Document
					</h2>
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
				</div>
			</div>
		</>
	);
};
