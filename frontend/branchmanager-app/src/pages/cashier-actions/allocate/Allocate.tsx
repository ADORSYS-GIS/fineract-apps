import { PageHeader } from "@/components/PageHeader";
import { Route } from "../../../routes/tellers.$tellerId.cashiers.$cashierId.allocate";
import { allocateSchema, type FormValues } from "./Allocate.types";
import { AllocateView } from "./Allocate.view";
import { useAllocate } from "./useAllocate";

export const Allocate = () => {
	const { tellerId, cashierId } = Route.useParams();
	const {
		initialValues,
		currencyOptions,
		loadingTemplate,
		onSubmit,
		isSubmitting,
	} = useAllocate(Number(tellerId), Number(cashierId));

	const handleSubmit = async (values: FormValues) => {
		allocateSchema.parse(values);
		onSubmit(values);
	};

	return (
		<div>
			<PageHeader title="Allocate Funds" />
			<AllocateView
				initialValues={initialValues}
				currencyOptions={currencyOptions}
				isLoading={loadingTemplate}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				submitLabel="Allocate"
			/>
		</div>
	);
};
