import { Button, Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
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
	return (
		<div className="flex justify-center">
			<div className="w-full max-w-2xl">
				<Card>
					<div className="p-6 sm:p-8">
						<h2 className="text-2xl font-bold mb-6">Create Teller</h2>
						<Form<TellerCreateFormValues>
							initialValues={initialValues}
							onSubmit={onSubmit}
						>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
								<div className="sm:col-span-2">
									<Input
										name="name"
										label="Teller Name *"
										placeholder="Enter teller name"
									/>
								</div>
								<div className="sm:col-span-2">
									<Input
										name="status"
										label="Status *"
										type="select"
										options={[
											{ label: "Active", value: 300 },
											{ label: "Inactive", value: 400 },
										]}
									/>
								</div>
								<div className="sm:col-span-2">
									<Input
										name="description"
										label="Description"
										placeholder="Description (optional)"
									/>
								</div>
								<Input name="startDate" label="Start Date *" type="date" />
								<Input name="endDate" label="End Date" type="date" />
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
									Cancel
								</Button>
								<SubmitButton
									label={isSubmitting ? "Submitting..." : "Submit"}
								/>
							</div>
						</Form>
					</div>
				</Card>
			</div>
		</div>
	);
}
