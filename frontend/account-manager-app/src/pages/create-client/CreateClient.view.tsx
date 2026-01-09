import {
	Button,
	Form,
	Input,
	SubmitButton,
	useFormContext,
} from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { CreateClientForm as CreateClientFormType } from "./CreateClient.types";
import { useCreateClient } from "./useCreateClient";

const CreateClientForm: FC = () => {
	const { t } = useTranslation();
	useFormContext<CreateClientFormType>();

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
					placeholder={t("createClient.email.placeholder")}
				/>
				<Input
					name="mobileNo"
					label={t("createClient.mobileNumber.label")}
					placeholder={t("createClient.mobileNumber.placeholder")}
				/>
			</div>
			<div className="flex items-center justify-between mt-6">
				<Input
					name="active"
					type="checkbox"
					label={t("createClient.active.label")}
				/>
			</div>
			<div className="mt-4">
				<Input
					name="activationDate"
					label={t("createClient.activationDate.label")}
					type="date"
					placeholder={t("createClient.activationDate.placeholder")}
				/>
			</div>
		</>
	);
};

export const CreateClientView: FC<ReturnType<typeof useCreateClient>> = ({
	initialValues,
	onSubmit,
	isCreatingClient,
}) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center">
					{t("createClient.title")}
				</h1>
				<p className="text-center text-gray-600">
					{t("createClient.description")}
				</p>
				<Form initialValues={initialValues} onSubmit={onSubmit}>
					<CreateClientForm />
					<div className="flex justify-end space-x-4 mt-8">
						<Button
							type="button"
							variant="secondary"
							onClick={() => navigate({ to: "/dashboard" })}
						>
							{t("cancel")}
						</Button>
						<SubmitButton
							label={isCreatingClient ? t("creatingClient") : t("common.save")}
							disabled={isCreatingClient}
						/>
					</div>
				</Form>
			</div>
		</div>
	);
};
