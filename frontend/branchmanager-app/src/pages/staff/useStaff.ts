import {
	useStaffServiceGetV1Staff,
	useTellerCashManagementServiceGetV1Tellers,
	useTellerCashManagementServiceGetV1TellersByTellerIdCashiers,
} from "@fineract-apps/fineract-api";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

type StaffItem = {
	id: number;
	displayName?: string;
	firstname?: string;
	lastname?: string;
	officeName?: string;
	mobileNo?: string;
};

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

export function useStaffPage() {
	const [search, setSearch] = useState("");
	const [searchTellers, setSearchTellers] = useState("");
	const [searchAssignments, setSearchAssignments] = useState("");
	const [selectedTellerId, setSelectedTellerIdState] = useState<number | null>(
		null,
	);
	const [selectedStaffId, setSelectedStaffIdState] = useState<number | null>(
		null,
	);

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

	const tellerItems: TellerItem[] = useMemo(() => {
		if (!Array.isArray(tellers)) return [];
		return tellers.filter((i): i is TellerItem => {
			if (typeof i !== "object" || i === null) return false;
			const rec = i as { id?: unknown; name?: unknown };
			return typeof rec.id === "number";
		});
	}, [tellers]);

	const staffItems: StaffItem[] = useMemo(() => {
		if (!Array.isArray(staff)) return [];
		return staff.filter((m): m is StaffItem => {
			if (typeof m !== "object" || m === null) return false;
			const rec = m as { id?: unknown };
			return typeof rec.id === "number";
		});
	}, [staff]);

	useEffect(() => {
		if (!selectedTellerId && tellerItems.length > 0)
			setSelectedTellerIdState(tellerItems[0].id);
	}, [tellerItems, selectedTellerId]);

	useEffect(() => {
		if (!selectedStaffId && staffItems.length > 0)
			setSelectedStaffIdState(staffItems[0].id);
	}, [staffItems, selectedStaffId]);

	const filteredTellers = useMemo(() => {
		const q = searchTellers.toLowerCase();
		return tellerItems.filter((t) =>
			(t.name ?? `Teller ${t.id}`).toLowerCase().includes(q),
		);
	}, [tellerItems, searchTellers]);

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
				(c.description ?? "").toLowerCase().includes(q),
		);
	}, [assignmentsResp, searchAssignments]);

	const staffErrorMsg = isError
		? ((error as Error)?.message ?? "Error")
		: undefined;
	const tellersErrorMsg = tellersError
		? ((tellersErrorObj as Error)?.message ?? "Error")
		: undefined;
	const assignmentsErrorMsg = assignmentsError
		? ((assignmentsErrorObj as Error)?.message ?? "Error")
		: undefined;

	const navigate = useNavigate();
	const onNewAssignment = () => {
		if (!selectedStaffId) return;
		navigate({ to: `/staff/${selectedStaffId}/assign` });
	};

	return {
		search,
		setSearch,
		searchTellers,
		setSearchTellers,
		searchAssignments,
		setSearchAssignments,
		staffItems: staffItems.filter((s) =>
			(
				s.displayName ||
				`${s.firstname ?? ""} ${s.lastname ?? ""}`.toLowerCase()
			).includes(search.toLowerCase()),
		),
		isLoadingStaff: isLoading,
		staffError: staffErrorMsg,
		selectedStaffId,
		setSelectedStaffId: (id: number) => setSelectedStaffIdState(id),
		tellerItems: filteredTellers,
		loadingTellers,
		tellersError: tellersErrorMsg,
		selectedTellerId,
		setSelectedTellerId: (id: number) => setSelectedTellerIdState(id),
		assignments,
		loadingAssignments,
		assignmentsError: assignmentsErrorMsg,
		onNewAssignment,
	};
}
