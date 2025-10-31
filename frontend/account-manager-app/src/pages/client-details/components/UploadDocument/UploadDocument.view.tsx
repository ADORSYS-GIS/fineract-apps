import { Button, Form, Input } from "@fineract-apps/ui";
import { FC } from "react";
import { Modal } from "../../../../components/Modal/Modal";
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

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Upload Document">
			<Form initialValues={initialValues} onSubmit={onSubmit}>
				<div className="space-y-4">
					<Input name="name" label="File Name" placeholder="Enter file name" />
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
		</Modal>
	);
};
