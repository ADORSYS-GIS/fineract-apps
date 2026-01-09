import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/hooks/useCurrency";
import { Route } from "@/routes/tellers.$tellerId.cashiers.$cashierId.settle";
import { type FormValues, settleSchema } from "./Settle.types";
import { SettleView } from "./Settle.view";
import { useSettle } from "./useSettle";

export const Settle = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { tellerId, cashierId } = Route.useParams();
	const { currencyCode } = useCurrency();
	const { initialValues, onSubmit, isSubmitting } = useSettle(
		Number(tellerId),
		Number(cashierId),
		currencyCode ?? "",
	);

	const handleSubmit = (values: FormValues) => {
		settleSchema.parse(values);
		onSubmit(values);
	};

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			{/* No back button on form pages; Cancel provided in form */}
			<SettleView
				initialValues={initialValues}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				submitLabel={t("settle.settle")}
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
