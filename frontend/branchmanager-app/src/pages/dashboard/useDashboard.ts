import {
	useTellerCashManagementServiceGetV1Tellers,
	useTellerCashManagementServiceGetV1TellersByTellerIdCashiers,
} from "@fineract-apps/fineract-api";
import { useEffect, useMemo, useState } from "react";

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
	const [selectedTellerId, setSelectedTellerIdState] = useState<number | null>(
		null,
	);

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

	useEffect(() => {
		if (!selectedTellerId && tellerItems.length > 0)
			setSelectedTellerIdState(tellerItems[0].id);
	}, [tellerItems, selectedTellerId]);

	const {
		data: assignmentsResp,
		isLoading: loadingAssignments,
		isError: assignmentsError,
		error: assignmentsErrorObj,
	} = useTellerCashManagementServiceGetV1TellersByTellerIdCashiers(
		{ tellerId: Number(selectedTellerId ?? 0) },
		["tellers", selectedTellerId, "cashiers"],
		{ enabled: selectedTellerId !== null, staleTime: 30_000 },
	);

	const assignments: TellerAssignment[] = useMemo(() => {
		const list: unknown = (assignmentsResp as unknown as { cashiers?: unknown })
			?.cashiers;
		const array = Array.isArray(list) ? (list as TellerAssignment[]) : [];
		const q = searchAssignments.toLowerCase();
		return array.filter(
			(c) =>
				(c.staffName ?? "").toLowerCase().includes(q) ||
				(c.description ?? "").toLowerCase().includes(q) ||
				(c.tellerName ?? "").toLowerCase().includes(q),
		);
	}, [assignmentsResp, searchAssignments]);

	const assignmentsErrorMsg = assignmentsError
		? ((assignmentsErrorObj as Error)?.message ?? "Error")
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
