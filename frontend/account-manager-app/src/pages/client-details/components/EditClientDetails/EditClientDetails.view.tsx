import { ClientData } from "@fineract-apps/fineract-api";
import { Button, Form, Input } from "@fineract-apps/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../../components/Modal/Modal";
import { useEditClient } from "./useEditClient";

export const EditClientDetails: FC<{
	isOpen: boolean;
	onClose: () => void;
	client: ClientData | undefined;
}> = ({ isOpen, onClose, client }) => {
	const { onSubmit, isEditingClient } = useEditClient(onClose);
	const { t } = useTranslation();

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={t("editClientDetails.title")}
		>
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
						label={t("createClient.firstName.label")}
						placeholder={t("createClient.firstName.placeholder")}
					/>
					<Input
						name="lastname"
						label={t("createClient.lastName.label")}
						placeholder={t("createClient.lastName.placeholder")}
					/>
					<Input
						name="emailAddress"
						label={t("createClient.email.label")}
						type="email"
						placeholder={t("createClient.email.placeholder")}
					/>
					<Input
						name="mobileNo"
						label={t("clientDetails.phone")}
						type="text"
						placeholder={t("createClient.mobileNumber.placeholder")}
					/>
					<Button
						type="submit"
						className="w-full bg-green-500 hover:bg-green-600 text-white"
						disabled={isEditingClient}
					>
						{isEditingClient
							? t("editClientDetails.savingButton")
							: t("editClientDetails.saveChangesButton")}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};
