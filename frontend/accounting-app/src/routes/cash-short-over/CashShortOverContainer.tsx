import { CashShortOverView } from "./CashShortOverView";
import { useCashShortOver } from "./useCashShortOver";

export function CashShortOverContainer() {
	const {
		formData,
		errors,
		variance,
		varianceType,
		isSubmitting,
		onFormChange,
		onSubmit,
		onReset,
	} = useCashShortOver();

	return (
		<CashShortOverView
			formData={formData}
			errors={errors}
			variance={variance}
			varianceType={varianceType}
			isSubmitting={isSubmitting}
			onFormChange={onFormChange}
			onSubmit={onSubmit}
			onReset={onReset}
		/>
	);
}
