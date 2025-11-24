import { useTranslation } from "react-i18next";
import { CashierActionForm } from "@/components/CashierActionForm";
import type { FormValues } from "./Settle.types";

export const SettleView = ({
	initialValues,
	onSubmit,
	isSubmitting,
	submitLabel,
	onCancel,
}: {
	initialValues: FormValues;
	onSubmit: (values: FormValues) => Promise<void> | void;
	isSubmitting: boolean;
	submitLabel?: string;
	onCancel?: () => void;
}) => {
	const { t } = useTranslation();
	return (
		<CashierActionForm
			initialValues={initialValues}
			onSubmit={onSubmit}
			isSubmitting={isSubmitting}
			submitLabel={submitLabel || t("settleCash")}
			onCancel={onCancel}
			title={t("settleCash")}
		/>
	);
};
