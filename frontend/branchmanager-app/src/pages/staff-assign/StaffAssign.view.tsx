import { Form, FormTitle, Input, SubmitButton } from "@fineract-apps/ui";
import type { FormValues, TellerOption } from "./StaffAssign.types";

export const StaffAssignView = ({
	initialValues,
	tellerOptions,
	isLoadingTellers,
	onSubmit,
	isSubmitting,
	submitLabel = "Assign",
}: {
	initialValues: FormValues;
	tellerOptions: TellerOption[];
	isLoadingTellers: boolean;
	onSubmit: (values: FormValues) => Promise<void> | void;
	isSubmitting: boolean;
	submitLabel?: string;
}) => {
	return (
		<div className="px-6 py-6">
			<Form<FormValues> initialValues={initialValues} onSubmit={onSubmit}>
				<FormTitle>Assign Staff to Teller</FormTitle>
				<div className="grid grid-cols-1 gap-4">
					<Input
						name="tellerId"
						label="Teller"
						type="select"
						disabled={isLoadingTellers}
						options={tellerOptions.map((t) => ({
							value: t.id,
							label: t.name ?? `Teller ${t.id}`,
						}))}
					/>
					<Input
						name="staffId"
						label="Staff ID"
						disabled
						helperText="Prefilled from selected staff"
					/>
					<Input
						name="description"
						label="Description"
						placeholder="Notes (optional)"
					/>
					<Input name="startDate" label="Start date" type="date" />
					<Input name="endDate" label="End date" type="date" />
					<div className="flex items-center gap-3">
						<Input name="isFullDay" type="checkbox" label="Full day" />
					</div>
					<SubmitButton
						label={isSubmitting ? `${submitLabel}...` : submitLabel}
					/>
				</div>
			</Form>
		</div>
	);
};
