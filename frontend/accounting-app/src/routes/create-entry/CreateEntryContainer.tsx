import { CreateEntryView } from "./CreateEntryView";
import { useCreateEntry } from "./useCreateEntry";

export function CreateEntryContainer() {
	const {
		formData,
		debits,
		credits,
		isBalanced,
		isSubmitting,
		onFormChange,
		onAddDebit,
		onRemoveDebit,
		onAddCredit,
		onRemoveCredit,
		onDebitChange,
		onCreditChange,
		onSubmit,
	} = useCreateEntry();

	return (
		<CreateEntryView
			formData={formData}
			debits={debits}
			credits={credits}
			isBalanced={isBalanced}
			isSubmitting={isSubmitting}
			onFormChange={onFormChange}
			onAddDebit={onAddDebit}
			onRemoveDebit={onRemoveDebit}
			onAddCredit={onAddCredit}
			onRemoveCredit={onRemoveCredit}
			onDebitChange={onDebitChange}
			onCreditChange={onCreditChange}
			onSubmit={onSubmit}
		/>
	);
}
