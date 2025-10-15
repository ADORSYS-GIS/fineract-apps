import { TellerCashManagementService } from "@fineract-apps/fineract-api";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

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
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data: tellersData, isLoading: isLoadingTellers } = useQuery({
		queryKey: ["tellers"],
		queryFn: () => TellerCashManagementService.getV1Tellers(),
	});

	const assignmentsQueries = useQueries({
		queries:
			tellersData?.map((teller) => ({
				queryKey: ["tellerCashiers", teller.id],
				queryFn: () =>
					TellerCashManagementService.getV1TellersByTellerIdCashiers({
						tellerId: teller.id as number,
					}),
				enabled: !!tellersData,
			})) ?? [],
	});

	const { assignments, isLoading, isError } = useMemo(() => {
		const isLoading =
			isLoadingTellers || assignmentsQueries.some((q) => q.isLoading);
		const isError = assignmentsQueries.some((q) => q.isError);

		if (isLoading || isError || !tellersData) {
			return { assignments: [], isLoading, isError };
		}

		const combinedAssignments = tellersData.flatMap((teller, index) => {
			const queryResult = assignmentsQueries[index];
			if (queryResult.isSuccess && queryResult.data) {
				return (
					queryResult.data.cashiers?.map((assignment) => ({
						...assignment,
						tellerName: teller.name,
					})) ?? []
				);
			}
			return [];
		});

		return { assignments: combinedAssignments, isLoading, isError };
	}, [tellersData, assignmentsQueries, isLoadingTellers]);

	const filteredAssignments = useMemo(() => {
		if (!assignments) return [];
		const q = searchAssignments.toLowerCase();
		return (assignments as unknown as TellerAssignment[])
			.filter(
				(c: TellerAssignment) =>
					(c.staffName ?? "").toLowerCase().includes(q) ||
					(c.description ?? "").toLowerCase().includes(q) ||
					(c.tellerName ?? "").toLowerCase().includes(q),
			)
			.sort((a: TellerAssignment, b: TellerAssignment) => a.id - b.id);
	}, [assignments, searchAssignments]);

	const paginatedAssignments = useMemo(
		() => filteredAssignments.slice((page - 1) * limit, page * limit),
		[filteredAssignments, page],
	);

	function onLogout() {
		// Use proxy-provided logout endpoint from mod_auth_openidc under app base
		const base = import.meta.env.BASE_URL || "/branchmanager/";
		const appBase = base.endsWith("/") ? base : `${base}/`;
		const redirectUri = `${window.location.origin}${appBase}`;
		const logoutUrl = new URL(`${appBase}logout`, window.location.origin);
		// mod_auth_openidc commonly uses "rd" for post-logout redirect
		logoutUrl.searchParams.set("rd", redirectUri);
		window.location.href = logoutUrl.toString();
	}

	return {
		title: "Branch Manager Dashboard",
		query,
		setQuery,
		searchAssignments,
		setSearchAssignments,
		assignments: paginatedAssignments,
		loadingAssignments: isLoading,
		assignmentsError: isError ? "Error fetching assignments" : undefined,
		page,
		limit,
		total: filteredAssignments.length,
		setPage,
		onLogout,
	};
}
