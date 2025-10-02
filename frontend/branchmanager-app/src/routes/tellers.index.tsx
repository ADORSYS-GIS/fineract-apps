import { useTellerCashManagementServiceGetV1Tellers } from "@fineract-apps/fineract-api";
import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

interface Teller {
	id: number;
	name: string;
	officeName: string;
	startDate: number[] | string;
	status: string;
}

function TellersListPage() {
	const {
		data: tellers,
		isLoading,
		isError,
		error,
	} = useTellerCashManagementServiceGetV1Tellers();
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [selectedTellerId, setSelectedTellerId] = useState<number | null>(null);

	const filteredTellers = useMemo(() => {
		if (!tellers) return [];
		return (tellers as Teller[]).filter(
			(teller) =>
				teller.name.toLowerCase().includes(search.toLowerCase()) ||
				teller.officeName.toLowerCase().includes(search.toLowerCase()),
		);
	}, [tellers, search]);

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h1 className="text-2xl font-bold">Tellers</h1>
					<p className="text-gray-500">Manage tellers and their assignments.</p>
				</div>
				<Link to="/tellers/create">
					<Button>+ Create Teller</Button>
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-6">
				<Card
					className="h-full"
					title={<span className="text-xl">Available Tellers</span>}
				>
					<SearchBar
						value={search}
						onValueChange={setSearch}
						placeholder="Filter tellers..."
					/>
					<div className="mt-4 space-y-3">
						{isLoading && <div>Loading...</div>}
						{isError && (
							<div className="text-red-600">{(error as Error)?.message}</div>
						)}
						{!isLoading &&
							!isError &&
							filteredTellers.map((teller) => {
								const isSelected = selectedTellerId === teller.id;
								return (
									<button
										key={teller.id}
										type="button"
										onClick={() => {
											setSelectedTellerId(teller.id);
											navigate({
												to: "/tellers/$tellerId",
												params: { tellerId: String(teller.id) },
											});
										}}
										className={`w-full flex items-center justify-between p-3 rounded-md border bg-white text-left transition ${isSelected ? "border-gray-400 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
									>
										<div>
											<p className="font-medium text-gray-800">{teller.name}</p>
											<p className="text-sm text-gray-500">
												{teller.officeName}
											</p>
										</div>
										<span className="text-sm text-gray-500">
											{teller.status}
										</span>
									</button>
								);
							})}
					</div>
				</Card>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/tellers/")({
	component: TellersListPage,
});
