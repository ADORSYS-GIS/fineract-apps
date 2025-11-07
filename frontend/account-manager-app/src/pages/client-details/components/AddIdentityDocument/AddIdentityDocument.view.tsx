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
		<Modal isOpen={isOpen} onClose={onClose} title={t("addIdentityDocument")}>
			<Form initialValues={initialValues} onSubmit={onSubmit}>
				<div className="space-y-4">
					<Input
						name="documentTypeId"
						label={t("documentType")}
						type="select"
						options={[
							{ label: t("passport"), value: "1" },
							{ label: t("idCard"), value: "2" },
							{ label: t("driversLicense"), value: "3" },
							{ label: t("otherTypes"), value: "4" },
						]}
					/>
					<Input
						name="status"
						label={t("status")}
						type="select"
						options={[
							{ label: t("active"), value: "ACTIVE" },
							{ label: t("inactive"), value: "INACTIVE" },
						]}
					/>
					<Input
						name="documentKey"
						label={t("documentKey")}
						placeholder={t("enterDocumentKey")}
					/>
					<Button
						type="submit"
						className="w-full bg-green-500 hover:bg-green-600 text-white"
						disabled={isPending}
					>
						{isPending ? t("submitting") : t("submit")}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};
