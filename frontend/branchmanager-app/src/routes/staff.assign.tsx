import {
	useStaffServiceGetV1Staff,
	useTellerCashManagementServiceGetV1Tellers,
	useTellerCashManagementServiceGetV1TellersByTellerIdCashiers,
} from "@fineract-apps/fineract-api";
import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

type TellerAssignment = {
	id: number;
	tellerName?: string;
	staffName?: string;
	staffId?: number;
	startDate?: string;
	endDate?: string;
	isFullDay?: boolean;
	description?: string;
};

type TellerAssignmentsResponse = {
	cashiers: TellerAssignment[];
};

const isTellerAssignmentsResponse = (
	value: unknown,
): value is TellerAssignmentsResponse => {
	if (typeof value !== "object" || value === null) {
		return false;
	}
	const record = value as { cashiers?: unknown };
	return Array.isArray(record.cashiers);
};

function StaffAssignPage() {
	const [search, setSearch] = useState("");
	const [searchTellers, setSearchTellers] = useState("");
	const [searchAssignments, setSearchAssignments] = useState("");
	const [selectedTellerId, setSelectedTellerId] = useState<number | null>(null);

	const {
		data: staff,
		isLoading,
		isError,
		error,
	} = useStaffServiceGetV1Staff({ status: "all" }, ["staff", "all"], {
		staleTime: 60_000,
	});

	const {
		data: tellers,
		isLoading: loadingTellers,
		isError: tellersError,
		error: tellersErrorObj,
	} = useTellerCashManagementServiceGetV1Tellers({}, ["tellers"], {
		staleTime: 60_000,
	});

	type TellerItem = { id: number; name?: string };

	const tellerItems = useMemo(() => {
		if (!Array.isArray(tellers)) {
			return [] as TellerItem[];
		}
		return tellers.filter((item): item is TellerItem => {
			if (typeof item !== "object" || item === null) {
				return false;
			}
			const candidate = item as { id?: unknown; name?: unknown };
			return typeof candidate.id === "number";
		});
	}, [tellers]);

	useEffect(() => {
		if (!selectedTellerId && tellerItems.length > 0) {
			setSelectedTellerId(tellerItems[0].id);
		}
	}, [tellerItems, selectedTellerId]);

	const filteredTellers = useMemo(() => {
		const q = searchTellers.toLowerCase();
		return tellerItems.filter((t) =>
			(t.name ?? `Teller ${t.id}`).toLowerCase().includes(q),
		);
	}, [tellerItems, searchTellers]);

	const {
		data: assignments,
		isLoading: loadingAssignments,
		isError: assignmentsError,
		error: assignmentsErrorObj,
	} = useTellerCashManagementServiceGetV1TellersByTellerIdCashiers(
		{ tellerId: Number(selectedTellerId ?? 0) },
		["tellers", selectedTellerId, "cashiers"],
		{ enabled: selectedTellerId !== null, staleTime: 30_000 },
	);

	const filteredAssignments = useMemo<TellerAssignment[]>(() => {
		if (!isTellerAssignmentsResponse(assignments)) {
			return [];
		}
		const q = searchAssignments.toLowerCase();
		return assignments.cashiers.filter((c) => {
			const staffName = (c.staffName ?? "").toLowerCase();
			const desc = (c.description ?? "").toLowerCase();
			return staffName.includes(q) || desc.includes(q);
		});
	}, [assignments, searchAssignments]);

	return (
		<div className="px-6 py-6">
			<div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Manage Staff Assignments
					</h1>
					<p className="text-gray-500">
						Assign cashiers to tellers using the interface.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button>New Assignment</Button>
					<Button>Save Assignments</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 grid-auto-rows-1fr">
				<Card
					className="h-full"
					title={<span className="text-xl">Available Staff</span>}
				>
					<SearchBar
						value={search}
						onValueChange={setSearch}
						placeholder="Filter staff..."
					/>
					<div className="mt-4 space-y-3">
						{isLoading && <div>Loading...</div>}
						{isError && (
							<div className="text-red-600">
								{(error as Error)?.message ?? "Error"}
							</div>
						)}
						{!isLoading &&
							!isError &&
							Array.isArray(staff) &&
							staff
								.filter((s) =>
									(s.displayName || `${s.firstname} ${s.lastname}`)
										.toLowerCase()
										.includes(search.toLowerCase()),
								)
								.map((s) => (
									<div
										key={s.id}
										className="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-white"
									>
										<div>
											<p className="font-medium text-gray-800">
												{s.displayName || `${s.firstname} ${s.lastname}`}
											</p>
											<p className="text-sm text-gray-500">
												{s.officeName || ""}
											</p>
										</div>
										<span className="text-sm text-gray-500">
											{s.mobileNo || "-"}
										</span>
									</div>
								))}
					</div>
				</Card>

				<Card
					className="h-full"
					title={<span className="text-xl">Tellers</span>}
				>
					<SearchBar
						value={searchTellers}
						onValueChange={setSearchTellers}
						placeholder="Filter tellers..."
					/>
					<div className="mt-4 space-y-3">
						{loadingTellers && <div>Loading...</div>}
						{tellersError && (
							<div className="text-red-600">
								{(tellersErrorObj as Error)?.message ?? "Error"}
							</div>
						)}
						{!loadingTellers &&
							!tellersError &&
							filteredTellers.length === 0 && (
								<div className="text-gray-500">No tellers found.</div>
							)}
						{filteredTellers.map((t) => (
							<button
								key={t.id}
								type="button"
								onClick={() => setSelectedTellerId(t.id)}
								className={`w-full text-left p-3 rounded-md border bg-white shadow-sm transition ${
									selectedTellerId === t.id
										? "border-gray-400"
										: "border-gray-200 hover:border-gray-300"
								}`}
							>
								<p className="font-medium text-gray-800">
									{t.name ?? `Teller ${t.id}`}
								</p>
								<p className="text-sm text-gray-500">ID: {t.id}</p>
							</button>
						))}
					</div>
				</Card>
				<div className="lg:col-span-2">
					<Card className="h-full">
						<div className="flex justify-between">
							<h2 className="text-xl font-bold text-gray-800 mb-3">
								Current Assignments
							</h2>
							<SearchBar
								value={searchAssignments}
								onValueChange={setSearchAssignments}
								placeholder="Filter by staff or description..."
							/>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-sm text-left text-gray-500">
								<thead className="text-xs text-gray-700 uppercase bg-gray-50">
									<tr>
										<th className="px-6 py-3">Teller</th>
										<th className="px-6 py-3">Staff</th>
										<th className="px-6 py-3">Start</th>
										<th className="px-6 py-3">End</th>
										<th className="px-6 py-3">Full Day</th>
										<th className="px-6 py-3">Description</th>
									</tr>
								</thead>
								<tbody>
									{loadingAssignments && (
										<tr className="bg-white border-b">
											<td className="px-6 py-4 text-gray-500" colSpan={6}>
												Loading...
											</td>
										</tr>
									)}
									{assignmentsError && (
										<tr className="bg-white border-b">
											<td className="px-6 py-4 text-red-600" colSpan={6}>
												{(assignmentsErrorObj as Error)?.message ?? "Error"}
											</td>
										</tr>
									)}
									{!loadingAssignments &&
										!assignmentsError &&
										(filteredAssignments.length > 0 ? (
											filteredAssignments.map((assignment) => (
												<tr key={assignment.id} className="bg-white border-b">
													<td className="px-6 py-4">
														{assignment.tellerName ??
															(selectedTellerId
																? `Teller ${selectedTellerId}`
																: "-")}
													</td>
													<td className="px-6 py-4 font-medium text-gray-900">
														{assignment.staffName ?? assignment.staffId}
													</td>
													<td className="px-6 py-4">
														{assignment.startDate ?? "-"}
													</td>
													<td className="px-6 py-4">
														{assignment.endDate ?? "-"}
													</td>
													<td className="px-6 py-4">
														{assignment.isFullDay ? "Yes" : "No"}
													</td>
													<td className="px-6 py-4">
														{assignment.description ?? "-"}
													</td>
												</tr>
											))
										) : (
											<tr className="bg-white border-b">
												<td className="px-6 py-4 text-gray-500" colSpan={6}>
													No assignments.
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/staff/assign")({
	component: StaffAssignPage,
});
