import { UsersService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { User } from "./UserTable.types";

export const useUserTable = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["users"],
		queryFn: () => UsersService.getV1Users(),
	});

	const users: User[] = (data || []).map((user) => ({
		id: user.id || 0,
		username: user.username || "",
		firstname: user.firstname || "",
		lastname: user.lastname || "",
		email: user.email || "",
		officeName: user.officeName,
		available: user.staff?.isActive,
	}));

	return {
		users,
		isLoading,
		isError,
	};
};
