import { StaffService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { StaffDetailData } from "./StaffDetail.view";

export function useStaffDetail(staffId: number) {
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["staff", staffId],
		queryFn: async () =>
			(await StaffService.getV1StaffByStaffId({ staffId })) ?? null,
	});
	const detail: StaffDetailData | undefined = useMemo(() => {
		if (!data) return undefined;
		return {
			firstname: data.firstname ?? "",
			lastname: data.lastname ?? "",
			externalId: data.externalId,
			mobileNo: data.mobileNo,
			officeName: data.officeName,
			isLoanOfficer: data.isLoanOfficer,
			isActive: data.isActive,
			joiningDate: data.joiningDate,
		};
	}, [data]);

	return {
		data: detail,
		isLoading,
		error: isError ? (error?.message ?? "Error") : undefined,
	};
}
