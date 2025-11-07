import { CashierActionForm } from "@/components/CashierActionForm";
import type { FormValues } from "./Allocate.types";

export const AllocateView = ({
	initialValues,
	onSubmit,
	isSubmitting,
	submitLabel = "Allocate",
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
			title="Allocate Funds"
		/>
	);
};
