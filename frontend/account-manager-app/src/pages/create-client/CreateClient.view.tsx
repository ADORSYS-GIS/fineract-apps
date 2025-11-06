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
					placeholder={t("enterEmailAddress")}
				/>
				<Input
					name="mobileNo"
					label={t("mobileNumber")}
					placeholder={t("enterMobileNumber")}
				/>
			</div>
			<div className="flex items-center justify-between mt-6">
				<Input name="active" type="checkbox" label={t("active")} />
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
					{t("createNewClient")}
				</h1>
				<p className="text-center text-gray-600">
					{t("fillInTheDetailsBelowToCreateANewClientRecord")}
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
							label={isCreatingClient ? t("creatingClient") : t("createClient")}
							disabled={isCreatingClient}
						/>
					</div>
				</Form>
			</div>
		</div>
	);
};
