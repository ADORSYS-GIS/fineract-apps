import { GetUsersResponse, UsersService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { User } from "./UserTable.types";

const PAGE_SIZE = 10;

export const useUserTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const { data, isLoading, isError } = useQuery({
		queryKey: ["employees"],
		queryFn: () => UsersService.getV1Users(),
	});

	const users: User[] = (data || []).map((user: GetUsersResponse) => ({
		id: user.id ?? 0,
		username: user.username ?? "",
		firstname: user.firstname ?? "",
		lastname: user.lastname ?? "",
		email: user.email ?? "",
		officeName: user.officeName ?? "",
		available: true, // Assuming all employees are active
	}));

	const filteredUsers = useMemo(
		() =>
			users.filter(
				(user) =>
					user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.username.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		[users, searchTerm],
	);

	const paginatedUsers = useMemo(
		() =>
			filteredUsers.slice(
				(currentPage - 1) * PAGE_SIZE,
				currentPage * PAGE_SIZE,
			),
		[filteredUsers, currentPage],
	);

	const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

	return {
		users: paginatedUsers,
		isLoading,
		isError,
		searchTerm,
		setSearchTerm,
		currentPage,
		setCurrentPage,
		totalPages,
	};
};
