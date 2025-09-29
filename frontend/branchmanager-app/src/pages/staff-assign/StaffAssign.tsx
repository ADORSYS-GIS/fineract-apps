import { Route } from "../../routes/staff.$staffId.assign";
import { type FormValues, staffAssignSchema } from "./StaffAssign.types";
import { StaffAssignView } from "./StaffAssign.view";
import { useStaffAssign } from "./useStaffAssign";

export const StaffAssign = () => {
	const { staffId } = Route.useParams();
	const staffIdNum = Number(staffId);
	const {
		initialValues,
		tellerOptions,
		isLoadingTellers,
		onSubmit,
		isSubmitting,
	} = useStaffAssign(Number.isFinite(staffIdNum) ? staffIdNum : null);

	// The Form component handles validation via schema prop in the original code,
	// we keep behavior by simply delegating to onSubmit here.
	const handleSubmit = async (values: FormValues) => {
		// client-side validate minimal required fields matching previous schema
		staffAssignSchema.parse(values);
		await onSubmit(values);
	};

	return (
		<>
			<StaffAssignView
				initialValues={initialValues}
				tellerOptions={tellerOptions}
				isLoadingTellers={isLoadingTellers}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				submitLabel="Assign"
			/>
		</>
	);
};
