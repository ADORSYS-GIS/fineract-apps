import { CreateEntryView } from "./CreateEntryView";
import { useCreateEntry } from "./useCreateEntry";

export function CreateEntryContainer() {
	const {
		formData,
		debits,
		credits,
		glAccounts,
		isBalanced,
		isSubmitting,
		currencyCode,
		onFormChange,
		onAddDebit,
		onRemoveDebit,
		onAddCredit,
		onRemoveCredit,
		onDebitChange,
		onCreditChange,
		onSubmit,
		onCancel,
	} = useCreateEntry();

	return (
		<CreateEntryView
			formData={formData}
			debits={debits}
			credits={credits}
			glAccounts={glAccounts}
			isBalanced={isBalanced}
			isSubmitting={isSubmitting}
			currencyCode={currencyCode}
			onFormChange={onFormChange}
			onAddDebit={onAddDebit}
			onRemoveDebit={onRemoveDebit}
			onAddCredit={onAddCredit}
			onRemoveCredit={onRemoveCredit}
			onDebitChange={onDebitChange}
			onCreditChange={onCreditChange}
			onSubmit={onSubmit}
			onCancel={onCancel}
		/>
	);
}
