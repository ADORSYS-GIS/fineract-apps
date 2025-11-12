import { StaffService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export const useStaffDetails = () => {
	const { staffId } = useParams({ from: "/staff/$staffId/" });

	const { data: staffData, isLoading: isLoadingStaff } = useQuery({
		queryKey: ["staff", staffId],
		queryFn: () =>
			StaffService.getV1StaffByStaffId({ staffId: Number(staffId) }),
	});

	return {
		staffData,
		isLoadingStaff,
	};
};
