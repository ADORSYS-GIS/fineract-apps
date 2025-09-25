import {
	useTellerCashManagementServiceGetV1Tellers,
	useTellerCashManagementServiceGetV1TellersByTellerIdCashiers,
	useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdAllocate,
} from "@fineract-apps/fineract-api";
import { Button, Card, Form, Input } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

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

	const { data: cashiersResp, isLoading: loadingCashiers } =
		useTellerCashManagementServiceGetV1TellersByTellerIdCashiers(
			{ tellerId: Number(firstTellerId ?? 0) },
			["tellers", firstTellerId, "cashiers"],
			{ enabled: firstTellerId !== null, staleTime: 30_000 },
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
						Allocate Funds
					</h2>
					<Form<AllocateValues>
						initialValues={initialValues}
						onSubmit={async (values) => {
							const tellerId = Number(values.tellerId || firstTellerId || 0);
							const cashierId = Number(values.cashierId || 0);
							if (!tellerId || !cashierId) return;
							const payload = {
								currencyCode: String(values.currencyCode || "XAF"),
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
							// basic UX feedback
							alert("Funds allocated successfully");
						}}
						className="bg-transparent shadow-none p-0"
					>
						<Input
							name="tellerId"
							label="Teller"
							type="select"
							options={[
								{ label: "Select Teller", value: "" },
								...tellerOptions.map((t) => ({
									label: t.name ?? `Teller ${t.id}`,
									value: String(t.id),
								})),
							]}
							disabled={loadingTellers}
						/>
						<Input
							name="cashierId"
							label="Cashier"
							type="select"
							options={[
								{ label: "Select Cashier", value: "" },
								...cashierOptions.map((c) => ({
									label: c.staffName ?? c.description ?? `Cashier ${c.id}`,
									value: String(c.id),
								})),
							]}
							disabled={loadingCashiers}
						/>
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
							options={[
								{ label: "XAF", value: "XAF" },
								{ label: "USD", value: "USD" },
								{ label: "EUR", value: "EUR" },
							]}
						/>
						<Input name="date" label="Date" type="date" />
						<Input
							name="notes"
							label="Notes"
							type="textarea"
							placeholder="Add optional notes..."
						/>
						<div className="flex justify-end pt-2">
							<Button type="submit" disabled={allocateMutation.isPending}>
								{allocateMutation.isPending
									? "Allocating..."
									: "Allocate Funds"}
							</Button>
						</div>
					</Form>
				</Card>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/funds/allocate")({
	component: AllocateFundsPage,
});
