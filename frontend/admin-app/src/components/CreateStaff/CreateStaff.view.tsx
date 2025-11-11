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
import { toFormikValidationSchema } from "zod-formik-adapter";
import { staffFormSchema } from "@/components/StaffForm/staffFormSchema";
import { useCreateStaff } from "./useCreateStaff";

import { useTranslation } from "react-i18next";
export const CreateStaffView = () => {
	const { t } = useTranslation();
	const { initialValues, officeOptions, isCreatingStaff, onSubmit, error } =
		useCreateStaff();

	return (
		<div>
			<Link to="/staff/list">
				<Button variant="ghost" size="sm" className="mb-4">
					<ArrowLeft className="w-4 h-4 mr-2" />
					{t("backToStaff")}
				</Button>
			</Link>

			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					{t("createNewStaff")}
				</h1>
				<p className="text-sm text-gray-600 mt-1">
					{t("addStaffDescription")}
				</p>
			</div>

			<div>
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<Formik
							initialValues={initialValues}
							onSubmit={onSubmit}
							validationSchema={toFormikValidationSchema(staffFormSchema)}
							enableReinitialize
						>
							{() => (
								<Form>
									<FormTitle>{t("staffInformation")}</FormTitle>

									{error && (
										<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
											{error}
										</div>
									)}

									<div className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<Input
												name="firstname"
												label={t("firstName")}
												type="text"
												placeholder={t("enterFirstName")}
												required
											/>

											<Input
												name="lastname"
												label={t("lastName")}
												type="text"
												placeholder={t("enterLastName")}
												required
											/>
										</div>

										<Input
											name="mobileNo"
											label={t("phoneNumberOptional")}
											type="text"
											placeholder="+1234567890"
										/>

										<Input
											name="officeId"
											label={t("office")}
											type="select"
											required
											options={officeOptions}
										/>

										<Input
											name="joiningDate"
											label={t("joiningDate")}
											type="date"
											required
										/>

										<Input
											name="isLoanOfficer"
											label={t("isLoanOfficer")}
											type="checkbox"
										/>

										<Input
											name="isActive"
											label={t("isActive")}
											type="checkbox"
										/>

										<div className="pt-4 flex items-center gap-3">
											<SubmitButton
												label={
													isCreatingStaff
														? t("creatingStaff")
														: t("createStaff")
												}
											/>
											<Link to="/staff/list">
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
