import { BusinessDateManagementService } from "@fineract-apps/fineract-api";

/**
 * Formats a business date string for HTML date input (yyyy-MM-dd format)
 * Handles various input formats like "2025,11,30" or "2025-11-30"
 */
function formatBusinessDateForInput(dateString: string): string {
	try {
		// Handle comma-separated format like "2025,11,30"
		if (dateString.includes(",")) {
			const parts = dateString.split(",");
			if (parts.length === 3) {
				const year = parts[0].padStart(4, "0");
				const month = parts[1].padStart(2, "0");
				const day = parts[2].padStart(2, "0");
				return `${year}-${month}-${day}`;
			}
		}

		// If already in correct format, return as-is
		if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
			return dateString;
		}

		// Try to parse as Date object and format
		const date = new Date(dateString);
		if (!Number.isNaN(date.getTime())) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			return `${year}-${month}-${day}`;
		}

		// Fallback: return current date
		const today = new Date();
		const yyyy = today.getFullYear();
		const mm = String(today.getMonth() + 1).padStart(2, "0");
		const dd = String(today.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	} catch (error) {
		console.error("Failed to format business date:", error);
		// Fallback: return current date
		const today = new Date();
		const yyyy = today.getFullYear();
		const mm = String(today.getMonth() + 1).padStart(2, "0");
		const dd = String(today.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	}
}

/**
 * Business Date Service
 * Central service for fetching business date from the backend
 */
export class BusinessDateService {
	/**
	 * Fetches the current business date from the backend
	 * @returns Promise resolving to the business date string
	 */
	static async getBusinessDate(): Promise<string> {
		try {
			const response =
				await BusinessDateManagementService.getV1BusinessdateByType({
					type: "BUSINESS_DATE",
				});

			if (response.date) {
				return response.date;
			}

			throw new Error("Business date not found in response");
		} catch (error) {
			console.error("Failed to fetch business date:", error);
			throw error;
		}
	}

	/**
	 * Fetches all business dates from the backend
	 * @returns Promise resolving to array of business date objects
	 */
	static async getAllBusinessDates() {
		try {
			const response = await BusinessDateManagementService.getV1Businessdate();
			return response;
		} catch (error) {
			console.error("Failed to fetch business dates:", error);
			throw error;
		}
	}
}

/**
 * Fetches the current business date from the backend
 * @returns Promise resolving to the business date string in yyyy-MM-dd format
 * Always returns a valid date, with fallback to current date on error
 */
export async function getBusinessDate(): Promise<string> {
	try {
		const dateString = await BusinessDateService.getBusinessDate();
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
 * Fetches business date by type from the backend
 * @param type - The type of business date to fetch
 * @returns Promise resolving to the business date string in yyyy-MM-dd format
 * Always returns a valid date, with fallback to current date on error
 */
export async function getBusinessDateByType(
	type: "BUSINESS_DATE" | "COB_DATE",
): Promise<string> {
	try {
		const response =
			await BusinessDateManagementService.getV1BusinessdateByType({
				type,
			});

		if (response.date) {
			return formatBusinessDateForInput(response.date);
		}

		throw new Error("Business date not found in response");
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
