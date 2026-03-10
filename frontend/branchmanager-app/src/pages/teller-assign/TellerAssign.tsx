import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Route } from "@/routes/tellers.$tellerId.assign";
import { type FormValues, tellerAssignSchema } from "./TellerAssign.types";
import { TellerAssignView } from "./TellerAssign.view";
import { useTellerAssign } from "./useTellerAssign";

export const TellerAssign = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { tellerId } = Route.useParams();
	const tellerIdNum = Number(tellerId);
	const handleSuccess = () => {
		navigate({
			to: "/tellers/$tellerId",
			params: { tellerId },
			search: {
				page: 1,
				pageSize: 20,
				q: "",
			},
		});
	};
	const {
		initialValues,
		staffOptions,
		isLoadingStaff,
		onSubmit,
		isSubmitting,
		teller,
	} = useTellerAssign(
		Number.isFinite(tellerIdNum) ? tellerIdNum : null,
		handleSuccess,
	);

	const handleSubmit = async (values: FormValues) => {
		tellerAssignSchema.parse(values);
		await onSubmit(values);
	};

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			{/* No back button on form pages; Cancel provided in form */}
			<TellerAssignView
				initialValues={initialValues}
				staffOptions={staffOptions}
				isLoadingStaff={isLoadingStaff}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				submitLabel={t("tellerAssign.assign")}
				onCancel={() =>
					navigate({
						to: "/tellers/$tellerId",
						params: { tellerId },
						search: { page: 1, pageSize: 20, q: "" },
					})
				}
				tellerName={teller?.name}
			/>
		</div>
	);
};
