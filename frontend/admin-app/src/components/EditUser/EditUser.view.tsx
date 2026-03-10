import { OfficesService, RolesService } from "@fineract-apps/fineract-api";
import {
	Button,
	Card,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Form, Formik } from "formik";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { userEditFormSchema } from "@/components/UserForm/userFormSchema";
import { useEditUser } from "./useEditUser";

export const EditUserView = () => {
	const {
		initialValues,
		isUpdatingUser,
		isLoadingUser,
		onSubmit,
		user,
		error,
	} = useEditUser();
	const { t } = useTranslation();
	const { data: roles, isLoading: rolesLoading } = useQuery({
		queryKey: ["roles"],
		queryFn: () => RolesService.getV1Roles(),
	});

	const { data: offices, isLoading: officesLoading } = useQuery({
		queryKey: ["offices"],
		queryFn: () => OfficesService.getV1Offices(),
	});

	const roleOptions =
		roles?.map((role) => ({
			label: role.name || "",
			value: role.id || 0,
		})) || [];

	const officeOptions =
		offices?.map((office) => ({
			label: office.name || "",
			value: office.id || 0,
		})) || [];

	if (isLoadingUser) {
		return (
			<Card variant="elevated">
				<div className="p-8 text-center text-gray-500">
					{t("editUser.loading")}
				</div>
			</Card>
		);
	}

	if (!user) {
		return (
			<Card variant="elevated">
				<div className="p-8 text-center text-red-500">
					{t("editUser.notFound")}
				</div>
			</Card>
		);
	}

	return (
		<div>
			<Link to="/users/$userId" params={{ userId: user.id.toString() }}>
				<Button variant="ghost" size="sm" className="mb-4">
					<ArrowLeft className="w-4 h-4 mr-2" />
					{t("editUser.backToUserDetails")}
				</Button>
			</Link>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					{t("editUser.title")}
				</h1>
				<p className="text-sm text-gray-600 mt-1">{t("editUser.subtitle")}</p>
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
									<FormTitle>{t("editUser.formTitle")}</FormTitle>

									{error && (
										<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
											{error}
										</div>
									)}

									<div className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<Input
												name="firstname"
												label={t("createUser.firstNameLabel")}
												type="text"
												placeholder={t("createUser.firstNamePlaceholder")}
												required
											/>

											<Input
												name="lastname"
												label={t("createUser.lastNameLabel")}
												type="text"
												placeholder={t("createUser.lastNamePlaceholder")}
												required
											/>
										</div>

										<Input
											name="mobileNo"
											label={t("createUser.mobileNumberLabel")}
											type="text"
											placeholder={t("createUser.mobileNumberPlaceholder")}
										/>
										<div className="flex items-center space-x-2">
											<Input name="isLoanOfficer" type="checkbox" />
											<label
												htmlFor="isLoanOfficer"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												{t("createUser.loanOfficerLabel")}
											</label>
										</div>
										<Input
											name="roles"
											label={t("createUser.rolesLabel")}
											type="select"
											required
											options={roleOptions}
											disabled={rolesLoading}
											helperText={t("createUser.selectRole")}
										/>
										<Input
											name="officeId"
											label={t("createUser.officeLabel")}
											type="select"
											required
											options={officeOptions}
											disabled={officesLoading}
										/>
										<div className="pt-4 flex items-center gap-3">
											<SubmitButton
												label={
													isUpdatingUser
														? t("editUser.updating")
														: t("editUser.updateUser")
												}
											/>
											<Link
												to="/users/$userId"
												params={{ userId: user.id.toString() }}
											>
												<Button type="button" variant="outline">
													{t("editUser.cancel")}
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
