import { StaffService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { Staff } from "./StaffTable.types";

export const useStaffTable = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["staff"],
		queryFn: () => StaffService.getV1Staff(),
	});

	const staff: Staff[] = (data || []).map((staff) => ({
		id: staff.id || 0,
		firstname: staff.firstname || "",
		lastname: staff.lastname || "",
		displayName: staff.displayName || "",
		officeName: staff.officeName,
		isLoanOfficer: staff.isLoanOfficer,
		isActive: staff.isActive,
	}));

	return {
		staff,
		isLoading,
		isError,
	};
};
