import { Button, Form, Input } from "@fineract-apps/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/Modal/Modal";
import { useAddIdentityDocument } from "./useAddIdentityDocument";

export const AddIdentityDocument: FC<{
	isOpen: boolean;
	onClose: () => void;
}> = ({ isOpen, onClose }) => {
	const { initialValues, onSubmit, isPending } =
		useAddIdentityDocument(onClose);
	const { t } = useTranslation();

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={t("addIdentityDocument.title")}
		>
			<Form initialValues={initialValues} onSubmit={onSubmit}>
				<div className="space-y-4">
					<Input
						name="documentTypeId"
						label={t("addIdentityDocument.documentType.label")}
						type="select"
						options={[
							{
								label: t("addIdentityDocument.documentType.passport"),
								value: "1",
							},
							{
								label: t("addIdentityDocument.documentType.idCard"),
								value: "2",
							},
							{
								label: t("addIdentityDocument.documentType.driversLicense"),
								value: "3",
							},
							{
								label: t("addIdentityDocument.documentType.otherTypes"),
								value: "4",
							},
						]}
					/>
					<Input
						name="status"
						label={t("addIdentityDocument.status.label")}
						type="select"
						options={[
							{
								label: t("addIdentityDocument.status.active"),
								value: "ACTIVE",
							},
							{
								label: t("addIdentityDocument.status.inactive"),
								value: "INACTIVE",
							},
						]}
					/>
					<Input
						name="documentKey"
						label={t("addIdentityDocument.documentKey.label")}
						placeholder={t("addIdentityDocument.documentKey.placeholder")}
					/>
					<Button
						type="submit"
						className="w-full bg-green-500 hover:bg-green-600 text-white"
						disabled={isPending}
					>
						{isPending
							? t("addIdentityDocument.submittingButton")
							: t("addIdentityDocument.submitButton")}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};
