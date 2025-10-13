import { useNavigate } from "@tanstack/react-router";
import { Route } from "../../../routes/tellers.$tellerId.cashiers.$cashierId.allocate";
import { allocateSchema, type FormValues } from "./Allocate.types";
import { AllocateView } from "./Allocate.view";
import { useAllocate } from "./useAllocate";

export const Allocate = () => {
	const navigate = useNavigate();
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
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			{/* No back button on form pages; Cancel provided in form */}
			<AllocateView
				initialValues={initialValues}
				currencyOptions={currencyOptions}
				isLoading={loadingTemplate}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				submitLabel="Allocate"
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
