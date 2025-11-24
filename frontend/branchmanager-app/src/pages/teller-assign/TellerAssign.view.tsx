import {
	Button,
	Form,
	FormTitle,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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
	tellerName,
}: {
	initialValues: FormValues;
	staffOptions: StaffOption[];
	isLoadingStaff: boolean;
	onSubmit: (values: FormValues) => Promise<void> | void;
	isSubmitting: boolean;
	submitLabel?: string;
	onCancel?: () => void;
	tellerName?: string;
}) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<div className="px-6 py-6">
			<Form<FormValues> initialValues={initialValues} onSubmit={onSubmit}>
				<FormTitle>
					{t("assignStaff")}
					{tellerName ? ` to ${tellerName}` : ""}
				</FormTitle>
				<div className="grid grid-cols-1 gap-4">
					<Input
						name="staffId"
						label={t("staff")}
						type="select"
						disabled={isLoadingStaff}
						options={staffOptions.map((s) => ({
							value: s.id,
							label: s.displayName ?? `Staff ${s.id}`,
						}))}
					/>
					<Input
						name="description"
						label={t("createTeller.description.label")}
						placeholder={t("createTeller.description.placeholder")}
					/>
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
					{/* Time fields: required only when isFullDay is unchecked - validation enforces this */}
					{/* TimePicker consumes the form context itself, avoid calling useFormContext outside the Form provider */}
					<TimePicker startName="startTime" endName="endTime" />
					<div className="flex items-center gap-3">
						<Input
							name="isFullDay"
							type="checkbox"
							label={t("fullDayTableHeader")}
						/>
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
							{t("cancel")}
						</Button>
					</div>
				</div>
			</Form>
		</div>
	);
};
