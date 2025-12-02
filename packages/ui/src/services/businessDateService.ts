import { BusinessDateManagementService } from "@fineract-apps/fineract-api";
import { QueryClient } from "@tanstack/react-query";
import { formatBusinessDateForInput } from "../lib/utils";

/**
 * Singleton QueryClient instance for business date operations
 * Uses infinite stale time for indefinite caching since business dates change infrequently
 */
const businessDateQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity, // Cache indefinitely since business date changes infrequently
			gcTime: Infinity, // Keep in cache indefinitely
			retry: 3,
			retryDelay: (attemptIndex: number) =>
				Math.min(1000 * 2 ** attemptIndex, 30000),
		},
	},
});

/**
 * Fetches the current business date from the backend using TanStack Query for caching
 * @returns Promise resolving to the business date string in yyyy-MM-dd format
 * Always returns a valid date, with fallback to current date on error
 */
export async function getBusinessDate(): Promise<string> {
	try {
		const dateString = await businessDateQueryClient.fetchQuery({
			queryKey: ["business-date", "current"] as const,
			queryFn: async (): Promise<string> => {
				const response =
					await BusinessDateManagementService.getV1BusinessdateByType({
						type: "BUSINESS_DATE",
					});

				if (response.date) {
					return response.date;
				}

				throw new Error("Business date not found in response");
			},
		});
		return formatBusinessDateForInput(dateString);
	} catch (error) {
		console.error("Failed to fetch business date:", error);
		// Fallback to current date
		const today = new Date();
		const yyyy = today.getFullYear();
		const mm = String(today.getMonth() + 1).padStart(2, "0");
		const dd = String(today.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	}
}

/**
 * Fetches business date by type from the backend using TanStack Query for caching
 * @param type - The type of business date to fetch
 * @returns Promise resolving to the business date string in yyyy-MM-dd format
 * Always returns a valid date, with fallback to current date on error
 */
export async function getBusinessDateByType(
	type: "BUSINESS_DATE" | "COB_DATE",
): Promise<string> {
	try {
		const dateString = await businessDateQueryClient.fetchQuery({
			queryKey: ["business-date", type] as const,
			queryFn: async (): Promise<string> => {
				const response =
					await BusinessDateManagementService.getV1BusinessdateByType({
						type,
					});

				if (response.date) {
					return response.date;
				}

				throw new Error("Business date not found in response");
			},
		});
		return formatBusinessDateForInput(dateString);
	} catch (error) {
		console.error("Failed to fetch business date by type:", error);
		// Fallback to current date
		const today = new Date();
		const yyyy = today.getFullYear();
		const mm = String(today.getMonth() + 1).padStart(2, "0");
		const dd = String(today.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	}
}
