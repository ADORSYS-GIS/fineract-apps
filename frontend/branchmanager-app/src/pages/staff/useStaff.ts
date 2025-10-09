import { StaffService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

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

	const {
		data: staff,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["staff", "all"],
		queryFn: async () =>
			(await StaffService.getV1Staff({ status: "all" })) ?? [],
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

	const staffErrorMsg = isError ? (error?.message ?? "Error") : undefined;

	const navigate = useNavigate();
	const onStaffClick = (staffId: number) => {
		navigate({ to: `/staff/${staffId}` });
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
		onStaffClick,
	};
}
