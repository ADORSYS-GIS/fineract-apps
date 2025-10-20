import {
	Button,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import type { FormValues, StaffOption } from "./TellerAssign.types";
import { TimePicker } from "./TimePicker";

export const TellerAssignView = ({
	initialValues,
	staffOptions,
	isLoadingStaff,
	onSubmit,
	isSubmitting,
	submitLabel = "Assign",
	onCancel,
}: {
	initialValues: FormValues;
	staffOptions: StaffOption[];
	isLoadingStaff: boolean;
	onSubmit: (values: FormValues) => Promise<void> | void;
	isSubmitting: boolean;
	submitLabel?: string;
	onCancel?: () => void;
}) => {
	const navigate = useNavigate();

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
					{/* Time fields: required only when isFullDay is unchecked - validation enforces this */}
					{/* TimePicker consumes the form context itself, avoid calling useFormContext outside the Form provider */}
					<TimePicker startName="startTime" endName="endTime" />
					<div className="flex items-center gap-3">
						<Input name="isFullDay" type="checkbox" label="Full day" />
					</div>
					<div className="flex flex-col sm:flex-row justify-end gap-3">
						<SubmitButton
							label={isSubmitting ? `${submitLabel}...` : submitLabel}
							disabled={isSubmitting || staffOptions.length === 0}
						/>
						<Button
							variant="outline"
							onClick={() =>
								onCancel ? onCancel() : navigate({ to: "/tellers" })
							}
						>
							Cancel
						</Button>
					</div>
				</div>
			</Form>
		</div>
	);
};
