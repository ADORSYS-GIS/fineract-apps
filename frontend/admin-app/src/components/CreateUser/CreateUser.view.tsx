import { OfficesService, RolesService } from "@fineract-apps/fineract-api";
import {
	Button,
	Card,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createUserFormSchema } from "@/components/CreateUser/createUserFormSchema";
import { useCreateUser } from "./useCreateUser";

type CreateUserViewProps = ReturnType<typeof useCreateUser>;

export const CreateUserView = ({
	initialValues,
	onSubmit,
	onConfirmSync,
	creationStep,
	isLoading,
}: CreateUserViewProps) => {
	const { t } = useTranslation();
	const { data: offices, isLoading: officesLoading } = useQuery({
		queryKey: ["offices"],
		queryFn: () => OfficesService.getV1Offices(),
	});
	const { data: roles, isLoading: rolesLoading } = useQuery({
		queryKey: ["roles"],
		queryFn: () => RolesService.getV1Roles(),
	});

	const officeOptions =
		offices?.map((office) => ({
			label: office.name || "",
			value: office.id || 0,
		})) || [];

	const roleOptions =
		roles?.map((role) => ({
			label: role.name || "",
			value: role.id || 0,
		})) || [];

	if (creationStep.step === "confirm") {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<Card className="w-full max-w-md">
					<div className="p-6">
						<h2 className="text-xl font-semibold mb-4">
							{t("createUser.confirmUserSyncTitle")}
						</h2>
						<p className="mb-4">{t("createUser.confirmUserSyncMessage")}</p>
						<div className="space-y-2">
							<p>
								<strong>{t("createUser.usernameLabel")}:</strong>{" "}
								{creationStep.newUser?.username}
							</p>
							<p>
								<strong>{t("createUser.emailLabel")}:</strong>{" "}
								{creationStep.newUser?.email}
							</p>
						</div>
						<Button
							onClick={onConfirmSync}
							disabled={isLoading}
							className="mt-4 w-full"
						>
							{isLoading
								? t("createUser.syncing")
								: t("createUser.completeCreation")}
						</Button>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			<Card variant="elevated" size="lg">
				<div className="p-6">
					<Formik
						initialValues={initialValues}
						onSubmit={onSubmit}
						validationSchema={toFormikValidationSchema(createUserFormSchema)}
						enableReinitialize
					>
						{() => (
							<Form>
								<FormTitle>{t("createUser.formTitle")}</FormTitle>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
									<Input
										name="username"
										label={t("createUser.usernameLabel")}
										type="text"
										placeholder={t("createUser.usernamePlaceholder")}
										required
									/>
									<Input
										name="email"
										label={t("createUser.emailAddressLabel")}
										type="email"
										placeholder={t("createUser.emailPlaceholder")}
										required
									/>
									<Input
										name="mobileNo"
										label={t("createUser.mobileNumberLabel")}
										type="text"
										placeholder={t("createUser.mobileNumberPlaceholder")}
									/>
									<Input
										name="officeId"
										label={t("createUser.officeLabel")}
										type="select"
										required
										options={officeOptions}
										disabled={officesLoading}
									/>
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
										name="joiningDate"
										label={t("createUser.joiningDateLabel")}
										type="date"
										required
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
								</div>

								<div className="pt-4 flex items-center gap-3">
									<SubmitButton
										label={
											isLoading
												? t("createUser.creating")
												: t("createUser.createEmployee")
										}
									/>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</Card>
		</div>
	);
};
