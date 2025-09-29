import AllocateFundsView from "./AllocateFunds.view";
import { useAllocateFunds } from "./useAllocateFunds";

export default function AllocateFunds() {
	const state = useAllocateFunds();
	return (
		<AllocateFundsView
			initialValues={state.initialValues}
			loadingTellers={state.loadingTellers}
			tellerOptions={state.tellerOptions}
			pickerTellerId={state.pickerTellerId}
			setPickerTellerId={state.setPickerTellerId}
			pickerCashierId={state.pickerCashierId}
			setPickerCashierId={state.setPickerCashierId}
			loadingCashiers={state.loadingCashiers}
			cashierOptions={state.cashierOptions}
			selectedTellerId={state.selectedTellerId}
			setSelectedTellerId={state.setSelectedTellerId}
			selectedCashierId={state.selectedCashierId}
			setSelectedCashierId={state.setSelectedCashierId}
			hasSelection={state.hasSelection}
			loadingTemplate={state.loadingTemplate}
			currencyOptions={state.currencyOptions}
			defaultCurrencyCode={state.defaultCurrencyCode}
			allocate={async ({ tellerId, cashierId, payload }) => {
				await state.allocateMutation.mutateAsync({
					tellerId,
					cashierId,
					requestBody: payload,
				});
			}}
			isAllocating={state.allocateMutation.isPending}
		/>
	);
}
