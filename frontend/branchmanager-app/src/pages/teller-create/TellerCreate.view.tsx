import { Button, Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { TellerCreateFormValues } from "./TellerCreate.types";

export function TellerCreateView({
	initialValues,
	onSubmit,
	isSubmitting,
}: Readonly<{
	initialValues: TellerCreateFormValues;
	onSubmit: (values: TellerCreateFormValues) => Promise<void> | void;
	isSubmitting: boolean;
}>) {
	const { t } = useTranslation();
	const navigate = useNavigate({ from: "/tellers/create" });
	return (
		<div className="flex justify-center">
			<div className="w-full max-w-2xl">
				<Card>
					<div className="p-6 sm:p-8">
						<h2 className="text-2xl font-bold mb-6">
							{t("tellerCreate.createTeller")}
						</h2>
						<Form<TellerCreateFormValues>
							initialValues={initialValues}
							onSubmit={onSubmit}
						>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
								<div className="sm:col-span-2">
									<Input
										name="name"
										label={t("tellerCreate.tellerName")}
										placeholder={t("tellerCreate.enterTellerName")}
									/>
								</div>
								<div className="sm:col-span-2">
									<Input
										name="status"
										label={t("tellerCreate.status")}
										type="select"
										options={[
											{ label: t("tellerCreate.active"), value: 300 },
											{ label: t("tellerCreate.inactive"), value: 400 },
										]}
									/>
								</div>
								<div className="sm:col-span-2">
									<Input
										name="description"
										label={t("tellerCreate.description")}
										placeholder={t("tellerCreate.descriptionOptional")}
									/>
								</div>
								<Input
									name="startDate"
									label={t("tellerCreate.startDate")}
									type="date"
								/>
								<Input
									name="endDate"
									label={t("tellerCreate.endDate")}
									type="date"
								/>
							</div>
							<div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
								<Button
									variant="outline"
									onClick={() =>
										navigate({
											to: "/tellers",
											search: { page: 1, pageSize: 10, q: "" },
										})
									}
								>
									{t("tellerCreate.cancel")}
								</Button>
								<SubmitButton
									label={
										isSubmitting
											? t("tellerCreate.submitting")
											: t("tellerCreate.submit")
									}
								/>
							</div>
						</Form>
					</div>
				</Card>
			</div>
		</div>
	);
}
