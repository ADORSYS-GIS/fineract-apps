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
	const { t } = useTranslation();
	const { onSubmit, isEditingClient } = useEditClient(onClose);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={t("editClientDetails")}
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
						label={t("firstName")}
						placeholder={t("enterFirstName")}
					/>
					<Input
						name="lastname"
						label={t("lastName")}
						placeholder={t("enterLastName")}
					/>
					<Input
						name="emailAddress"
						label={t("email")}
						type="email"
						placeholder={t("enterEmailAddress")}
					/>
					<Input
						name="mobileNo"
						label={t("phone")}
						type="text"
						placeholder={t("enterMobileNumber")}
					/>
					<Button
						type="submit"
						className="w-full bg-green-500 hover:bg-green-600 text-white"
						disabled={isEditingClient}
					>
						{isEditingClient ? t("submitting") : t("saveChanges")}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};
