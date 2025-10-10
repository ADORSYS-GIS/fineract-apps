import { PageHeader } from "@/components/PageHeader";
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
		onSubmit(values);
	};

	return (
		<div>
			<PageHeader title="Settle Funds" />
			<SettleView
				initialValues={initialValues}
				currencyOptions={currencyOptions}
				isLoading={loadingTemplate}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				submitLabel="Settle"
			/>
		</div>
	);
};
