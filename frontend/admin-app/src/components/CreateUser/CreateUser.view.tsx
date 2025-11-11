import {
	Button,
	Card,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { Form, Formik } from "formik";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCreateUser } from "./useCreateUser";

export const CreateUserView = () => {
	const { t } = useTranslation();
	const {
		initialValues,
		staffOptions,
		roleOptions,
		isCreatingUser,
		onSubmit,
		error,
	} = useCreateUser();

	return (
		<div>
			<Link to="/users/list">
				<Button variant="ghost" size="sm" className="mb-4">
					<ArrowLeft className="w-4 h-4 mr-2" />
					{t("backToUsers")}
				</Button>
			</Link>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					{t("createNewUser")}
				</h1>
				<p className="text-sm text-gray-600 mt-1">
					{t("addUserDescription")}
				</p>
			</div>

			<div>
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<Formik
							initialValues={initialValues}
							onSubmit={onSubmit}
							enableReinitialize
						>
							{() => (
								<Form>
									<FormTitle>{t("userInformation")}</FormTitle>

									{error && (
										<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
											{error}
										</div>
									)}

									<div className="space-y-4">
										<Input
											name="username"
											label={t("username")}
											type="text"
											placeholder={t("enterUsername")}
											required
											helperText={t("usernameHelperText")}
										/>

										<Input
											name="email"
											label={t("emailAddress")}
											type="email"
											placeholder="user@example.com"
											required
										/>

										<Input
											name="staffId"
											label={t("staff")}
											type="select"
											required
											options={staffOptions}
										/>

										<Input
											name="roles"
											label={t("roles")}
											type="select"
											required
											options={roleOptions}
											helperText={t("rolesHelperText")}
										/>

										<Input
											name="password"
											label={t("passwordOptional")}
											type="password"
											placeholder={t("enterPassword")}
										/>
										<Input
											name="repeatPassword"
											label={t("repeatPassword")}
											type="password"
											placeholder={t("repeatPassword")}
										/>
										<Input
											name="sendPasswordToEmail"
											label={t("sendPasswordToEmail")}
											type="checkbox"
											helperText={t("sendPasswordToEmailHelperText")}
										/>

										<div className="pt-4 flex items-center gap-3">
											<SubmitButton
												label={
													isCreatingUser
														? t("creatingUser")
														: t("createUser")
												}
											/>
											<Link to="/users/list">
												<Button type="button" variant="outline">
													{t("cancel")}
												</Button>
											</Link>
										</div>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</Card>
			</div>
		</div>
	);
};
