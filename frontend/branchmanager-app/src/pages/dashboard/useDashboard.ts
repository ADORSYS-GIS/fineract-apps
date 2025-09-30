import {
	TellerCashManagementService,
	useTellerCashManagementServiceGetV1Tellers,
} from "@fineract-apps/fineract-api";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";

type TellerItem = { id: number; name?: string };

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

export function useDashboard() {
	const [query, setQuery] = useState("");
	const [searchAssignments, setSearchAssignments] = useState("");

	const { data: tellers } = useTellerCashManagementServiceGetV1Tellers(
		{},
		["tellers"],
		{
			staleTime: 60_000,
		},
	);

	const tellerItems: TellerItem[] = useMemo(() => {
		if (!Array.isArray(tellers)) return [];
		return tellers.filter((i): i is TellerItem => {
			if (typeof i !== "object" || i === null) return false;
			const rec = i as { id?: unknown; name?: unknown };
			return typeof rec.id === "number";
		});
	}, [tellers]);

	const assignmentQueries = useQueries({
		queries: tellerItems.map((teller) => ({
			queryKey: ["tellers", teller.id, "cashiers"],
			queryFn: () =>
				TellerCashManagementService.getV1TellersByTellerIdCashiers({
					tellerId: teller.id,
				}),
			staleTime: 30_000,
		})),
	});

	type QueryData = {
		cashiers?: TellerAssignment[];
	};

	const assignments: TellerAssignment[] = useMemo(() => {
		const allAssignments = assignmentQueries.flatMap((query) => {
			if (!query.data || !(query.data as QueryData).cashiers) return [];
			return (query.data as QueryData).cashiers ?? [];
		});
		const q = searchAssignments.toLowerCase();
		return allAssignments.filter(
			(c: TellerAssignment) =>
				(c.staffName ?? "").toLowerCase().includes(q) ||
				(c.description ?? "").toLowerCase().includes(q) ||
				(c.tellerName ?? "").toLowerCase().includes(q),
		);
	}, [assignmentQueries, searchAssignments]);

	const loadingAssignments = assignmentQueries.some((query) => query.isLoading);
	const assignmentsError = assignmentQueries.find((query) => query.isError);
	const assignmentsErrorMsg = assignmentsError
		? (assignmentsError.error?.message ?? "Error")
		: undefined;

	return {
		title: "Branch Manager Dashboard",
		query,
		setQuery,
		searchAssignments,
		setSearchAssignments,
		assignments,
		loadingAssignments,
		assignmentsError: assignmentsErrorMsg,
	};
}
