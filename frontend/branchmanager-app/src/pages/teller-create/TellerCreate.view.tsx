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
	const navigate = useNavigate({ from: "/tellers/create" });
	const { t } = useTranslation();
	return (
		<div className="flex justify-center">
			<div className="w-full max-w-2xl">
				<Card>
					<div className="p-6 sm:p-8">
						<h2 className="text-2xl font-bold mb-6">
							{t("createTeller.header")}
						</h2>
						<Form<TellerCreateFormValues>
							initialValues={initialValues}
							onSubmit={onSubmit}
						>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
								<div className="sm:col-span-2">
									<Input
										name="name"
										label={t("createTeller.name.label")}
										placeholder={t("createTeller.name.placeholder")}
									/>
								</div>
								<div className="sm:col-span-2">
									<Input
										name="status"
										label={t("createTeller.status.label")}
										type="select"
										options={[
											{
												label: t("createTeller.status.active"),
												value: 300,
											},
											{
												label: t("createTeller.status.inactive"),
												value: 400,
											},
										]}
									/>
								</div>
								<div className="sm:col-span-2">
									<Input
										name="description"
										label={t("createTeller.description.label")}
										placeholder={t("createTeller.description.placeholder")}
									/>
								</div>
								<Input
									name="startDate"
									label={t("createTeller.startDate.label")}
									type="date"
								/>
								<Input
									name="endDate"
									label={t("createTeller.endDate.label")}
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
									{t("cancel")}
								</Button>
								<SubmitButton
									label={isSubmitting ? t("submitting") : t("submit")}
								/>
							</div>
						</Form>
					</div>
				</Card>
			</div>
		</div>
	);
}
