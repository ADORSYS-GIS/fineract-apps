import { Button, Form, Input } from "@fineract-apps/ui";
import { FC } from "react";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={t("uploadDocument.title")}>
			<Form initialValues={initialValues} onSubmit={onSubmit}>
				<div className="space-y-4">
					<Input
						name="name"
						label={t("uploadDocument.fileName.label")}
						placeholder={t("uploadDocument.fileName.placeholder")}
					/>
					<Input name="file" label={t("uploadDocument.browse")} type="file" />
					<div className="flex justify-end space-x-4">
						<Button variant="secondary" onClick={onClose}>
							{t("accountManagerCommon.cancel")}
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending
								? t("uploadDocument.uploading")
								: t("accountManagerCommon.confirm")}
						</Button>
					</div>
				</div>
			</Form>
		</Modal>
	);
};
