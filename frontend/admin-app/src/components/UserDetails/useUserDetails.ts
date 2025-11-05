import { UsersService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export const useUserDetails = () => {
	const { userId } = useParams({ from: "/users/$userId/" });

	const { data: user, isLoading } = useQuery({
		queryKey: ["users", userId],
		queryFn: () =>
			UsersService.getV1UsersByUserId({ userId: Number.parseInt(userId, 10) }),
	});

	return {
		user,
		isLoading,
	};
};
