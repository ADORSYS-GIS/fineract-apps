import { Button, Card, Form, Input } from "@fineract-apps/ui";
import {
	AllocatePayload,
	AllocateValues,
	CashierItem,
	TellerItem,
} from "./AllocateFunds.types";
import { formatDateToLongDayMonthYear } from "./useAllocateFunds";

type Props = {
	initialValues: AllocateValues;
	loadingTellers: boolean;
	tellerOptions: TellerItem[];
	pickerTellerId: number | null;
	setPickerTellerId: (id: number | null) => void;
	pickerCashierId: number | null;
	setPickerCashierId: (id: number | null) => void;
	loadingCashiers: boolean;
	cashierOptions: CashierItem[];
	selectedTellerId: number | null;
	setSelectedTellerId: (id: number | null) => void;
	selectedCashierId: number | null;
	setSelectedCashierId: (id: number | null) => void;
	hasSelection: boolean;
	loadingTemplate: boolean;
	currencyOptions: { label: string; value: string }[];
	defaultCurrencyCode: string;
	allocate: (args: {
		tellerId: number;
		cashierId: number;
		payload: AllocatePayload;
	}) => Promise<void>;
	isAllocating: boolean;
};

export function AllocateFundsView(props: Props) {
	const {
		initialValues,
		loadingTellers,
		tellerOptions,
		pickerTellerId,
		setPickerTellerId,
		pickerCashierId,
		setPickerCashierId,
		loadingCashiers,
		cashierOptions,
		selectedTellerId,
		setSelectedTellerId,
		selectedCashierId,
		setSelectedCashierId,
		hasSelection,
		loadingTemplate,
		currencyOptions,
		defaultCurrencyCode,
		allocate,
		isAllocating,
	} = props;

	return (
		<div className="px-6 py-6">
			<header className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">
					Teller Fund Management
				</h1>
				<p className="text-gray-500 mt-1">
					Allocate and settle funds for your tellers.
				</p>
			</header>

			<div className="grid grid-cols-1 gap-6 max-w-3xl">
				<Card>
					<h2 className="text-xl font-bold text-gray-800 mb-4">
						Select Teller and Cashier
					</h2>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="teller-picker"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Teller
							</label>
							<select
								id="teller-picker"
								className="w-full border rounded-md px-3 py-2"
								value={pickerTellerId ?? ""}
								onChange={(e) => {
									const val = e.target.value ? Number(e.target.value) : null;
									setPickerTellerId(val);
									setPickerCashierId(null);
								}}
								disabled={loadingTellers}
							>
								<option value="">Select Teller</option>
								{tellerOptions.map((t) => (
									<option key={t.id} value={t.id}>
										{t.name ?? `Teller ${t.id}`}
									</option>
								))}
							</select>
						</div>
						<div>
							<label
								htmlFor="cashier-picker"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Cashier
							</label>
							<select
								id="cashier-picker"
								className="w-full border rounded-md px-3 py-2"
								value={pickerCashierId ?? ""}
								onChange={(e) => {
									const val = e.target.value ? Number(e.target.value) : null;
									setPickerCashierId(val);
								}}
								disabled={loadingCashiers}
							>
								<option value="">Select Cashier</option>
								{cashierOptions.map((c) => (
									<option key={c.id} value={c.id}>
										{c.staffName ?? c.description ?? `Cashier ${c.id}`}
									</option>
								))}
							</select>
						</div>
						<div className="flex justify-end pt-2">
							<Button
								onClick={() => {
									if (!pickerTellerId || !pickerCashierId) return;
									setSelectedTellerId(pickerTellerId);
									setSelectedCashierId(pickerCashierId);
								}}
								disabled={!pickerTellerId || !pickerCashierId}
							>
								Continue
							</Button>
						</div>
					</div>
				</Card>

				{hasSelection && (
					<Card>
						<h2 className="text-xl font-bold text-gray-800 mb-4">
							Allocate Funds
						</h2>
						{loadingTemplate ? (
							<div>Loading template...</div>
						) : (
							<Form<AllocateValues>
								initialValues={{
									...initialValues,
									currencyCode: defaultCurrencyCode,
								}}
								onSubmit={async (values) => {
									const tellerId = Number(selectedTellerId || 0);
									const cashierId = Number(selectedCashierId || 0);
									if (!tellerId || !cashierId) return;
									const payload = {
										currencyCode: String(
											values.currencyCode || defaultCurrencyCode,
										),
										dateFormat: "dd MMMM yyyy",
										locale: "en",
										txnAmount: Number(values.amount || 0),
										txnDate: formatDateToLongDayMonthYear(
											String(values.date || ""),
										),
										txnNote: String(values.notes || ""),
									};
									await allocate({ tellerId, cashierId, payload });
									alert("Funds allocated successfully");
								}}
								className="bg-transparent shadow-none p-0"
							>
								<div className="grid grid-cols-1 gap-4">
									<Input
										name="amount"
										label="Amount"
										type="number"
										placeholder="0.00"
									/>
									<Input
										name="currencyCode"
										label="Currency"
										type="select"
										options={currencyOptions}
									/>
									<Input name="date" label="Date" type="date" />
									<Input
										name="notes"
										label="Notes"
										type="textarea"
										placeholder="Add optional notes..."
									/>
								</div>
								<div className="flex items-center justify-between pt-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setSelectedTellerId(null);
											setSelectedCashierId(null);
										}}
									>
										Change selection
									</Button>
									<Button type="submit" disabled={isAllocating}>
										{isAllocating ? "Allocating..." : "Allocate Funds"}
									</Button>
								</div>
							</Form>
						)}
					</Card>
				)}
			</div>
		</div>
	);
}

export default AllocateFundsView;
