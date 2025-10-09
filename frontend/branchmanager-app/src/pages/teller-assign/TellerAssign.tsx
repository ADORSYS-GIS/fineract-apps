import { useNavigate } from "@tanstack/react-router";
import { Route } from "../../routes/tellers.$tellerId.assign";
import { type FormValues, tellerAssignSchema } from "./TellerAssign.types";
import { TellerAssignView } from "./TellerAssign.view";
import { useTellerAssign } from "./useTellerAssign";

export const TellerAssign = () => {
	const navigate = useNavigate();
	const { tellerId } = Route.useParams();
	const tellerIdNum = Number(tellerId);
	const handleSuccess = () => {
		navigate({
			to: "/tellers/$tellerId/cashiers",
			params: { tellerId },
		});
	};
	const {
		initialValues,
		staffOptions,
		isLoadingStaff,
		onSubmit,
		isSubmitting,
	} = useTellerAssign(
		Number.isFinite(tellerIdNum) ? tellerIdNum : null,
		handleSuccess,
	);

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
