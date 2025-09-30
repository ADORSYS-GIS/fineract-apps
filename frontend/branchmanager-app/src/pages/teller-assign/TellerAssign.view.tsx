import { Form, FormTitle, Input, SubmitButton } from "@fineract-apps/ui";
import type { FormValues, StaffOption } from "./TellerAssign.types";

export const TellerAssignView = ({
	initialValues,
	staffOptions,
	isLoadingStaff,
	onSubmit,
	isSubmitting,
	submitLabel = "Assign",
}: {
	initialValues: FormValues;
	staffOptions: StaffOption[];
	isLoadingStaff: boolean;
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
						label="Teller ID"
						disabled
						helperText="Prefilled from selected teller"
					/>
					<Input
						name="staffId"
						label="Staff"
						type="select"
						disabled={isLoadingStaff}
						options={staffOptions.map((s) => ({
							value: s.id,
							label: s.displayName ?? `Staff ${s.id}`,
						}))}
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
