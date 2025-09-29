import SettleFundsView from "./SettleFunds.view";
import { useSettleFunds } from "./useSettleFunds";

export default function SettleFunds() {
	const state = useSettleFunds();
	return (
		<SettleFundsView
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
			settle={async ({ tellerId, cashierId, payload }) => {
				await state.settleMutation.mutateAsync({
					tellerId,
					cashierId,
					requestBody: payload,
				});
			}}
			isSettling={state.settleMutation.isPending}
		/>
	);
}
