import { useStaffServiceGetV1StaffByStaffId } from "@fineract-apps/fineract-api";
import { useMemo } from "react";
import type { StaffDetailData } from "./StaffDetail.view";

export function useStaffDetail(staffId: number) {
	const { data, isLoading, isError, error } =
		useStaffServiceGetV1StaffByStaffId({ staffId }, ["staff", staffId]);
	const detail: StaffDetailData | undefined = useMemo(() => {
		if (!data) return undefined;
		return {
			title: data.displayName || `${data.firstname} ${data.lastname}`,
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
		error: isError ? ((error as Error)?.message ?? "Error") : undefined,
	};
}
