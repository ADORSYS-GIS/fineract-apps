import { useNavigate } from "@tanstack/react-router";
import { UserTable as UserTableView } from "@/components/UserTable/UserTable.view";
import { useUserTable } from "@/components/UserTable/useUserTable";

export const UserTable = () => {
	const {
		users,
		isLoading,
		searchTerm,
		setSearchTerm,
		currentPage,
		setCurrentPage,
		totalPages,
	} = useUserTable();
	const navigate = useNavigate();

	const handleRowClick = (userId: number) => {
		navigate({ to: `/users/${userId}` });
	};

	return (
		<UserTableView
			users={users}
			isLoading={isLoading}
			onRowClick={handleRowClick}
			searchTerm={searchTerm}
			setSearchTerm={setSearchTerm}
			currentPage={currentPage}
			setCurrentPage={setCurrentPage}
			totalPages={totalPages}
		/>
	);
};
