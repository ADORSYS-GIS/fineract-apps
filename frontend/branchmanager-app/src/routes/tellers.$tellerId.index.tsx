import { useTellerCashManagementServiceGetV1TellersByTellerIdCashiers } from "@fineract-apps/fineract-api";
import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

interface Cashier {
	id: number;
	staffId: number;
	staffName: string;
	description: string;
	startDate: number[] | string;
	endDate: number[] | string;
	isFullDay: boolean;
}

function TellerDetailPage() {
	const { tellerId } = Route.useParams();
	const navigate = useNavigate();
	const [search, setSearch] = useState("");

	const {
		data: cashiersResponse,
		isLoading,
		isError,
		error,
	} = useTellerCashManagementServiceGetV1TellersByTellerIdCashiers({
		tellerId: Number(tellerId),
	});

	interface CashiersResponse {
		cashiers?: Cashier[];
	}

	const cashiers = useMemo(() => {
		if (!cashiersResponse || !(cashiersResponse as CashiersResponse)?.cashiers)
			return [];
		return (cashiersResponse as CashiersResponse)?.cashiers?.filter(
			(cashier: Cashier) =>
				cashier.staffName.toLowerCase().includes(search.toLowerCase()) ||
				cashier.description.toLowerCase().includes(search.toLowerCase()),
		);
	}, [cashiersResponse, search]);

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h1 className="text-2xl font-bold">Teller Details</h1>
					<p className="text-gray-500">Details for teller ID: {tellerId}</p>
				</div>
				<Button
					onClick={() =>
						navigate({
							to: "/tellers/$tellerId/assign",
							params: { tellerId: tellerId },
						})
					}
				>
					New Assignment
				</Button>
			</div>
			<Card
				className="h-full"
				title={<span className="text-xl">Assigned Cashiers</span>}
			>
				<SearchBar
					value={search}
					onValueChange={setSearch}
					placeholder="Filter cashiers..."
				/>
				<div className="mt-4 space-y-3">
					{isLoading && <div>Loading...</div>}
					{isError && (
						<div className="text-red-600">{(error as Error)?.message}</div>
					)}
					{!isLoading &&
						!isError &&
						cashiers &&
						cashiers.map((cashier: Cashier) => (
							<button
								key={cashier.id}
								type="button"
								onClick={() =>
									navigate({
										to: "/tellers/$tellerId/cashiers/$cashierId",
										params: { tellerId, cashierId: String(cashier.id) },
									})
								}
								className="w-full flex items-center justify-between p-3 rounded-md border bg-white text-left transition border-gray-200 hover:border-gray-300"
							>
								<div>
									<p className="font-medium text-gray-800">
										{cashier.staffName}
									</p>
									<p className="text-sm text-gray-500">{cashier.description}</p>
								</div>
								<span className="text-sm text-gray-500">
									{Array.isArray(cashier.startDate)
										? cashier.startDate.join("-")
										: cashier.startDate}{" "}
									-{" "}
									{Array.isArray(cashier.endDate)
										? cashier.endDate.join("-")
										: cashier.endDate}
								</span>
							</button>
						))}
				</div>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/tellers/$tellerId/")({
	component: TellerDetailPage,
});
