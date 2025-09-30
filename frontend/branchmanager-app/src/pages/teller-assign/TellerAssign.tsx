import { Route } from "../../routes/tellers.$tellerId.assign";
import { type FormValues, tellerAssignSchema } from "./TellerAssign.types";
import { TellerAssignView } from "./TellerAssign.view";
import { useTellerAssign } from "./useTellerAssign";

export const TellerAssign = () => {
	const { tellerId } = Route.useParams();
	const tellerIdNum = Number(tellerId);
	const {
		initialValues,
		staffOptions,
		isLoadingStaff,
		onSubmit,
		isSubmitting,
	} = useTellerAssign(Number.isFinite(tellerIdNum) ? tellerIdNum : null);

	const handleSubmit = async (values: FormValues) => {
		tellerAssignSchema.parse(values);
		await onSubmit(values);
	};

	return (
		<TellerAssignView
			initialValues={initialValues}
			staffOptions={staffOptions}
			isLoadingStaff={isLoadingStaff}
			onSubmit={handleSubmit}
			isSubmitting={isSubmitting}
			submitLabel="Assign"
		/>
	);
};
