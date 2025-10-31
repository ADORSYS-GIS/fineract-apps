import { ClientData } from "@fineract-apps/fineract-api";
import { Button, Form, Input } from "@fineract-apps/ui";
import { FC } from "react";
import { Modal } from "../../../../components/Modal/Modal";
import { useEditClient } from "./useEditClient";

export const EditClientDetails: FC<{
	isOpen: boolean;
	onClose: () => void;
	client: ClientData | undefined;
}> = ({ isOpen, onClose, client }) => {
	const { onSubmit, isEditingClient } = useEditClient(onClose);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Edit Client Details">
			<Form
				initialValues={{
					firstname: client?.firstname ?? "",
					lastname: client?.lastname ?? "",
					emailAddress: client?.emailAddress ?? "",
					mobileNo: client?.mobileNo ?? "",
				}}
				onSubmit={onSubmit}
			>
				<div className="space-y-4">
					<Input
						name="firstname"
						label="First Name"
						placeholder="Enter first name"
					/>
					<Input
						name="lastname"
						label="Last Name"
						placeholder="Enter last name"
					/>
					<Input
						name="emailAddress"
						label="Email"
						type="email"
						placeholder="Enter email address"
					/>
					<Input
						name="mobileNo"
						label="Phone"
						type="text"
						placeholder="Enter mobile number"
					/>
					<Button
						type="submit"
						className="w-full bg-green-500 hover:bg-green-600 text-white"
						disabled={isEditingClient}
					>
						{isEditingClient ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};
