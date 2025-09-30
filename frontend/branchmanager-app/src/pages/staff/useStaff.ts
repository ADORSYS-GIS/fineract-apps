import { useStaffServiceGetV1Staff } from "@fineract-apps/fineract-api";
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

export function useStaffPage() {
	const [search, setSearch] = useState("");
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

	const staffItems: StaffItem[] = useMemo(() => {
		if (!Array.isArray(staff)) return [];
		return staff.filter((m): m is StaffItem => {
			if (typeof m !== "object" || m === null) return false;
			const rec = m as { id?: unknown };
			return typeof rec.id === "number";
		});
	}, [staff]);

	useEffect(() => {
		if (!selectedStaffId && staffItems.length > 0)
			setSelectedStaffIdState(staffItems[0].id);
	}, [staffItems, selectedStaffId]);

	const staffErrorMsg = isError
		? ((error as Error)?.message ?? "Error")
		: undefined;

	const navigate = useNavigate();
	const onNewAssignment = () => {
		if (!selectedStaffId) return;
		navigate({ to: `/staff/${selectedStaffId}/assign` });
	};

	return {
		search,
		setSearch,
		staffItems: staffItems.filter((s) =>
			(s.displayName || `${s.firstname ?? ""} ${s.lastname ?? ""}`)
				.toLowerCase()
				.includes(search.toLowerCase()),
		),
		isLoadingStaff: isLoading,
		staffError: staffErrorMsg,
		selectedStaffId,
		setSelectedStaffId: (id: number) => setSelectedStaffIdState(id),
		onNewAssignment,
	};
}
