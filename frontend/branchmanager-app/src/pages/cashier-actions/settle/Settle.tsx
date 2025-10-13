import { useNavigate } from "@tanstack/react-router";
import { Route } from "../../../routes/tellers.$tellerId.cashiers.$cashierId.settle";
import { type FormValues, settleSchema } from "./Settle.types";
import { SettleView } from "./Settle.view";
import { useSettle } from "./useSettle";

export const Settle = () => {
	const navigate = useNavigate();
	const { tellerId, cashierId } = Route.useParams();
	const {
		initialValues,
		currencyOptions,
		loadingTemplate,
		onSubmit,
		isSubmitting,
	} = useSettle(Number(tellerId), Number(cashierId));

	const handleSubmit = async (values: FormValues) => {
		settleSchema.parse(values);
		onSubmit(values);
	};

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			{/* No back button on form pages; Cancel provided in form */}
			<SettleView
				initialValues={initialValues}
				currencyOptions={currencyOptions}
				isLoading={loadingTemplate}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				submitLabel="Settle"
				onCancel={() =>
					navigate({
						to: "/tellers/$tellerId/cashiers/$cashierId",
						params: { tellerId, cashierId },
						search: { page: 1, pageSize: 10 },
					})
				}
			/>
		</div>
	);
};
