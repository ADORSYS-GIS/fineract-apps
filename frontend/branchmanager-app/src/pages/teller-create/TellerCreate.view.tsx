import { Card, Form, FormTitle, Input, SubmitButton } from "@fineract-apps/ui";
import type { TellerCreateFormValues } from "./TellerCreate.types";

export function TellerCreateView({
	initialValues,
	officeOptions,
	loadingOffices,
	onSubmit,
	isSubmitting,
}: {
	initialValues: TellerCreateFormValues;
	officeOptions: { label: string; value: number }[];
	loadingOffices: boolean;
	onSubmit: (values: TellerCreateFormValues) => Promise<void> | void;
	isSubmitting: boolean;
}) {
	return (
		<div className="max-w-screen-md mx-auto p-4 sm:p-6">
			<Card title={<span className="text-xl">Create New Teller</span>}>
				<Form<TellerCreateFormValues>
					initialValues={initialValues}
					onSubmit={onSubmit}
				>
					<FormTitle>New Teller Details</FormTitle>
					<div className="grid grid-cols-1 gap-4">
						<Input
							name="officeId"
							label="Office"
							type="select"
							disabled={loadingOffices}
							options={officeOptions.map((o) => ({
								label: o.label,
								value: o.value,
							}))}
						/>
						<Input name="name" label="Name" placeholder="Enter teller name" />
						<Input
							name="description"
							label="Description"
							placeholder="Description (optional)"
						/>
						<Input name="startDate" label="Start date" type="date" />
						<Input name="endDate" label="End date" type="date" />
						<Input
							name="status"
							label="Status"
							type="select"
							options={[
								{ label: "Active", value: 300 },
								{ label: "Inactive", value: 400 },
							]}
						/>
						<SubmitButton
							label={isSubmitting ? "Creating..." : "Create Teller"}
						/>
					</div>
				</Form>
			</Card>
		</div>
	);
}
