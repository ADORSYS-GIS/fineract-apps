import { Route } from "../../../routes/tellers.$tellerId.cashiers.$cashierId.settle";
import { type FormValues, settleSchema } from "./Settle.types";
import { SettleView } from "./Settle.view";
import { useSettle } from "./useSettle";

export const Settle = () => {
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
		await onSubmit(values);
	};

	return (
		<SettleView
			initialValues={initialValues}
			currencyOptions={currencyOptions}
			isLoading={loadingTemplate}
			onSubmit={handleSubmit}
			isSubmitting={isSubmitting}
			submitLabel="Settle"
		/>
	);
};
