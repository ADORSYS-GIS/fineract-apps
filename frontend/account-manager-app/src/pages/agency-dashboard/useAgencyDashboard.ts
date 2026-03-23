import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { useState } from "react";
import { getAgencyReport, getBranches } from "@/services/provisioningApi";

export const useAgencyDashboard = () => {
	const [fromDate, setFromDate] = useState(
		format(subDays(new Date(), 30), "yyyy-MM-dd"),
	);
	const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

	const { data: branches = [] } = useQuery({
		queryKey: ["branches"],
		queryFn: getBranches,
		staleTime: 5 * 60 * 1000, // branches rarely change
	});

	const {
		data: report,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["agencyReport", selectedBranch, fromDate, toDate],
		queryFn: () => getAgencyReport(selectedBranch, fromDate, toDate),
	});

	return {
		fromDate,
		setFromDate,
		toDate,
		setToDate,
		selectedBranch,
		setSelectedBranch,
		branches,
		report,
		isLoading,
		error,
	};
};
