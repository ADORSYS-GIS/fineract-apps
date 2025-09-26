import {
	useTellerCashManagementServiceGetV1Tellers,
	useTellerCashManagementServiceGetV1TellersByTellerIdCashiers,
	useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate,
	useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdAllocate,
} from "@fineract-apps/fineract-api";
import { Button, Card, Form, Input } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

type AllocateValues = {
	tellerId: string;
	cashierId: string;
	amount: number | string;
	currencyCode: string;
	date: string; // yyyy-MM-dd
	notes?: string;
};

type TellerItem = { id: number; name?: string };
type CashierItem = { id: number; staffName?: string; description?: string };

const isCashiersResponse = (
	value: unknown,
): value is { cashiers: CashierItem[] } => {
	if (typeof value !== "object" || value === null) return false;
	return Array.isArray((value as { cashiers?: unknown }).cashiers);
};

function formatDateToLongDayMonthYear(input: string): string {
	// input expected as yyyy-MM-dd
	if (!input) return "";
	const [y, m, d] = input.split("-").map((v) => Number(v));
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const monthName = monthNames[(m || 1) - 1] ?? "January";
	return `${d} ${monthName} ${y}`;
}

function AllocateFundsPage() {
	const initialValues: AllocateValues = {
		tellerId: "",
		cashierId: "",
		amount: "",
		currencyCode: "XAF",
		date: "",
		notes: "",
	};

	const { data: tellers, isLoading: loadingTellers } =
		useTellerCashManagementServiceGetV1Tellers({}, ["tellers"], {
			staleTime: 60_000,
		});

	const tellerOptions = useMemo(() => {
		if (!Array.isArray(tellers)) return [] as TellerItem[];
		return tellers.filter((t): t is TellerItem => {
			if (typeof t !== "object" || t === null) return false;
			const c = t as { id?: unknown };
			return typeof c.id === "number";
		});
	}, [tellers]);

	const firstTellerId = tellerOptions[0]?.id ?? null;

	// Step 1: small selection form state
	const [selectedTellerId, setSelectedTellerId] = useState<number | null>(null);
	const [selectedCashierId, setSelectedCashierId] = useState<number | null>(
		null,
	);
	const hasSelection = selectedTellerId !== null && selectedCashierId !== null;

	// For cashier options in Step 1, track currently chosen teller and cashier in the small form
	const [pickerTellerId, setPickerTellerId] = useState<number | null>(
		firstTellerId,
	);
	const [pickerCashierId, setPickerCashierId] = useState<number | null>(null);

	const { data: cashiersResp, isLoading: loadingCashiers } =
		useTellerCashManagementServiceGetV1TellersByTellerIdCashiers(
			{ tellerId: Number(pickerTellerId ?? 0) },
			["tellers", pickerTellerId, "cashiers"],
			{ enabled: pickerTellerId !== null, staleTime: 30_000 },
		);

	const cashierOptions = useMemo(() => {
		if (!isCashiersResponse(cashiersResp)) return [] as CashierItem[];
		return cashiersResp.cashiers.filter((c): c is CashierItem => {
			if (typeof c !== "object" || c === null) return false;
			const candidate = c as { id?: unknown };
			return typeof candidate.id === "number";
		});
	}, [cashiersResp]);

	const allocateMutation =
		useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdAllocate();

	// Fetch transactions template after selection
	const { data: template, isLoading: loadingTemplate } =
		useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate(
			{
				tellerId: Number(selectedTellerId ?? 0),
				cashierId: Number(selectedCashierId ?? 0),
			},
			["tellers", selectedTellerId, "cashiers", selectedCashierId, "template"],
			{ enabled: hasSelection },
		);

	const currencyOptions = useMemo(() => {
		const options =
			(
				template as unknown as
					| { currencyOptions?: { code: string; displayLabel?: string }[] }
					| undefined
			)?.currencyOptions ?? [];
		return options.map((c) => ({
			label: c.displayLabel ?? c.code,
			value: c.code,
		}));
	}, [template]);

	const defaultCurrencyCode = currencyOptions[0]?.value ?? "XAF";

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
									await allocateMutation.mutateAsync({
										cashierId,
										tellerId,
										requestBody: payload,
									});
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
									<Button type="submit" disabled={allocateMutation.isPending}>
										{allocateMutation.isPending
											? "Allocating..."
											: "Allocate Funds"}
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

export const Route = createFileRoute("/funds/allocate")({
	component: AllocateFundsPage,
});
