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
import { toFormikValidationSchema } from "zod-formik-adapter";
import { userEditFormSchema } from "@/components/UserForm/userFormSchema";
import { useEditUser } from "./useEditUser";

export const EditUserView = () => {
	const { t } = useTranslation();
	const {
		initialValues,
		officeOptions,
		staffOptions,
		roleOptions,
		isUpdatingUser,
		isLoadingUser,
		onSubmit,
		user,
		error,
	} = useEditUser();

	if (isLoadingUser) {
		return (
			<Card variant="elevated">
				<div className="p-8 text-center text-gray-500">Loading user...</div>
			</Card>
		);
	}

	if (!user) {
		return (
			<Card variant="elevated">
				<div className="p-8 text-center text-red-500">User not found.</div>
			</Card>
		);
	}

	return (
		<div>
			<Link to="/users/$userId" params={{ userId: user.id!.toString() }}>
				<Button variant="ghost" size="sm" className="mb-4">
					<ArrowLeft className="w-4 h-4 mr-2" />
					{t("Back to User Details")}
				</Button>
			</Link>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">{t("Edit User")}</h1>
				<p className="text-sm text-gray-600 mt-1">
					{t("Update the details of")} {user.username}
				</p>
			</div>

			<div className="max-w-3xl mx-auto">
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<Formik
							initialValues={initialValues}
							onSubmit={onSubmit}
							validationSchema={toFormikValidationSchema(userEditFormSchema)}
							enableReinitialize
						>
							{() => (
								<Form>
									<FormTitle>{t("User Information")}</FormTitle>

									{error && (
										<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
											{error}
										</div>
									)}

									<div className="space-y-4">
										<Input
											name="username"
											label={t("Username")}
											type="text"
											placeholder="Enter username"
											disabled
											helperText={t("Username cannot be changed")}
										/>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<Input
												name="firstname"
												label={t("First Name")}
												type="text"
												placeholder="Enter first name"
												required
											/>

											<Input
												name="lastname"
												label={t("Last Name")}
												type="text"
												placeholder="Enter last name"
												required
											/>
										</div>

										<Input
											name="email"
											label={t("Email Address")}
											type="email"
											placeholder="user@example.com"
											required
										/>

										<Input
											name="officeId"
											label={t("Office")}
											type="select"
											required
											options={officeOptions}
										/>

										<Input
											name="staffId"
											label={t("Staff")}
											type="select"
											required
											options={staffOptions}
										/>

										<Input
											name="roles"
											label={t("Roles")}
											type="select"
											required
											options={roleOptions}
											helperText={t("Select one or more roles for this user")}
										/>

										<div className="pt-4 flex items-center gap-3">
											<SubmitButton
												label={
													isUpdatingUser
														? t("Updating User...")
														: t("Update User")
												}
											/>
											<Link
												to="/users/$userId"
												params={{ userId: user.id!.toString() }}
											>
												<Button type="button" variant="outline">
													{t("Cancel")}
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
