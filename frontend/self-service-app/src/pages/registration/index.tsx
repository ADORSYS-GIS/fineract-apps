import { Button, Card, Input } from "@fineract-apps/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import { Form, Formik } from "formik";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRegistration } from "../../hooks/useRegistration";
import {
	RegistrationFormValues,
	registrationValidationSchema,
} from "./register.types";

export function RegisterPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const registerMutation = useRegistration();

	const initialValues: RegistrationFormValues = {
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		dateOfBirth: "",
		nationalId: "",
		address: {
			street: "",
			city: "",
			postalCode: "",
			country: "",
		},
	};

	if (registerMutation.isSuccess) {
		setTimeout(() => navigate({ to: "/" }), 3000);
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<Card className="max-w-md w-full text-center">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<CheckCircle className="w-8 h-8 text-green-600" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						{t("register.success")}
					</h2>
					<p className="text-gray-500">Redirecting to login...</p>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<Card className="max-w-lg w-full">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-gray-900">
						{t("register.title")}
					</h1>
					<p className="text-gray-500 mt-2">{t("register.subtitle")}</p>
				</div>
				<Formik
					initialValues={initialValues}
					validationSchema={toFormikValidationSchema(
						registrationValidationSchema,
					)}
					onSubmit={(values) => {
						registerMutation.mutate(values);
					}}
				>
					{() => (
						<Form className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									label={t("register.firstName")}
									name="firstName"
									disabled={registerMutation.isPending}
								/>
								<Input
									label={t("register.lastName")}
									name="lastName"
									disabled={registerMutation.isPending}
								/>
							</div>
							<Input
								label={t("register.email")}
								name="email"
								type="email"
								disabled={registerMutation.isPending}
							/>
							<Input
								label={t("register.phone")}
								name="phone"
								type="text"
								placeholder="+237 6XX XXX XXX"
								disabled={registerMutation.isPending}
							/>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									label={t("register.dateOfBirth")}
									name="dateOfBirth"
									type="date"
									disabled={registerMutation.isPending}
								/>
							</div>
							<Input
								label={t("register.nationalId", "National ID")}
								name="nationalId"
								disabled={registerMutation.isPending}
							/>
							<h3 className="text-lg font-medium border-b pt-4 pb-2">
								Address
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									label="Street"
									name="address.street"
									disabled={registerMutation.isPending}
								/>
								<Input
									label="City"
									name="address.city"
									disabled={registerMutation.isPending}
								/>
								<Input
									label="Postal Code"
									name="address.postalCode"
									disabled={registerMutation.isPending}
								/>
								<Input
									label="Country"
									name="address.country"
									disabled={registerMutation.isPending}
								/>
							</div>

							{registerMutation.isError && (
								<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
									{registerMutation.error?.message ||
										t("errors.generic", "An unexpected error occurred")}
								</div>
							)}

							<Button
								type="submit"
								className="w-full"
								variant="default"
								disabled={registerMutation.isPending}
								isLoading={registerMutation.isPending}
							>
								{t("register.submit")}
							</Button>
						</Form>
					)}
				</Formik>
				<p className="text-center text-gray-500 mt-6">
					{t("register.haveAccount")}{" "}
					<Link to="/login" className="text-blue-600 hover:underline">
						{t("auth.login")}
					</Link>
				</p>
			</Card>
		</div>
	);
}
