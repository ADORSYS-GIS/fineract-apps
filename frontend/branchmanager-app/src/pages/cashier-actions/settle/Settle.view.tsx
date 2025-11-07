import { CashierActionForm } from "@/components/CashierActionForm";
import type { FormValues } from "./Settle.types";

export const SettleView = ({
	initialValues,
	onSubmit,
	isSubmitting,
	submitLabel = "Settle",
	onCancel,
}: {
	initialValues: FormValues;
	onSubmit: (values: FormValues) => Promise<void> | void;
	isSubmitting: boolean;
	submitLabel?: string;
	onCancel?: () => void;
}) => {
	return (
		<CashierActionForm
			initialValues={initialValues}
			onSubmit={onSubmit}
			isSubmitting={isSubmitting}
			submitLabel={submitLabel}
			onCancel={onCancel}
			title="Settle Funds"
		/>
	);
};
