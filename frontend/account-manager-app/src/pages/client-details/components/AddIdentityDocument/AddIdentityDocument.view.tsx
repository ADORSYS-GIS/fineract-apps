import { Button, Form, Input } from "@fineract-apps/ui";
import { FC } from "react";
import { Modal } from "../../../../components/Modal/Modal";
import { useAddIdentityDocument } from "./useAddIdentityDocument";

export const AddIdentityDocument: FC<{
	isOpen: boolean;
	onClose: () => void;
}> = ({ isOpen, onClose }) => {
	const { initialValues, onSubmit, isPending } =
		useAddIdentityDocument(onClose);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Add Identity Document">
			<Form initialValues={initialValues} onSubmit={onSubmit}>
				<div className="space-y-4">
					<Input
						name="documentTypeId"
						label="Document Type"
						type="select"
						options={[
							{ label: "Passport", value: "1" },
							{ label: "ID Card", value: "2" },
							{ label: "Driver's License", value: "3" },
							{ label: "Other Types", value: "4" },
						]}
					/>
					<Input
						name="status"
						label="Status"
						type="select"
						options={[
							{ label: "Active", value: "ACTIVE" },
							{ label: "Inactive", value: "INACTIVE" },
						]}
					/>
					<Input
						name="documentKey"
						label="Document Key"
						placeholder="Enter Document Key"
					/>
					<Button
						type="submit"
						className="w-full bg-green-500 hover:bg-green-600 text-white"
						disabled={isPending}
					>
						{isPending ? "Submitting..." : "Submit"}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};
