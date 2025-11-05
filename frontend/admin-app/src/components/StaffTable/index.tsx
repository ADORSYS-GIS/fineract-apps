import { useNavigate } from "@tanstack/react-router";
import { StaffTable as StaffTableView } from "@/components/StaffTable/StaffTable.view";
import { useStaffTable } from "@/components/StaffTable/useStaffTable";

export const StaffTable = () => {
	const { staff, isLoading } = useStaffTable();
	const navigate = useNavigate();

	const handleRowClick = (staffId: number) => {
		navigate({ to: `/staff/${staffId}` });
	};

	const handleEditClick = (staffId: number) => {
		navigate({ to: `/staff/${staffId}/edit` });
	};

	const handleAssignUserClick = (staffId: number) => {
		navigate({ to: "/users/create", search: { staffId } });
	};

	return (
		<StaffTableView
			staff={staff}
			isLoading={isLoading}
			onRowClick={handleRowClick}
			onEditClick={handleEditClick}
			onAssignUserClick={handleAssignUserClick}
		/>
	);
};
