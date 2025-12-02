import { BusinessDateManagementService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { formatBusinessDateForInput } from "../lib/utils";

/**
 * Custom hook to fetch and manage business date state using TanStack Query
 * Provides a centralized way to get the current business date
 * with automatic caching, error handling, and loading states
 */
export const useBusinessDate = () => {
	const {
		data: businessDate,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["business-date", "current"] as const,
		queryFn: async (): Promise<string> => {
			const response =
				await BusinessDateManagementService.getV1BusinessdateByType({
					type: "BUSINESS_DATE",
				});

			if (response.date) {
				return formatBusinessDateForInput(response.date);
			}

			throw new Error("Business date not found in response");
		},
		staleTime: Infinity, // Cache indefinitely since business date changes infrequently
		gcTime: Infinity, // Keep in cache indefinitely
		retry: 3,
		retryDelay: (attemptIndex: number) =>
			Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	return {
		businessDate: businessDate || "",
		isLoading,
		error: error?.message || null,
		refetch,
	};
};
