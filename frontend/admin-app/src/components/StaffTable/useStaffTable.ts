import { StaffService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Staff } from "./StaffTable.types";

const PAGE_SIZE = 10;

export const useStaffTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
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

	const filteredStaff = useMemo(
		() =>
			staff.filter(
				(staffMember) =>
					staffMember.firstname
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					staffMember.lastname
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					staffMember.displayName
						.toLowerCase()
						.includes(searchTerm.toLowerCase()),
			),
		[staff, searchTerm],
	);

	const paginatedStaff = useMemo(
		() =>
			filteredStaff.slice(
				(currentPage - 1) * PAGE_SIZE,
				currentPage * PAGE_SIZE,
			),
		[filteredStaff, currentPage],
	);

	const totalPages = Math.ceil(filteredStaff.length / PAGE_SIZE);

	return {
		staff: paginatedStaff,
		isLoading,
		isError,
		searchTerm,
		setSearchTerm,
		currentPage,
		setCurrentPage,
		totalPages,
	};
};
