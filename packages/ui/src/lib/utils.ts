import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatCurrency = (
	amount: number | undefined | null,
	currencyCode?: string,
) => {
	if (amount === undefined || amount === null) {
		return "";
	}
	const formattedAmount = new Intl.NumberFormat("en-US", {
		style: "decimal",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);

	if (currencyCode) {
		return `${formattedAmount} ${currencyCode}`;
	}

	return formattedAmount;
};

export function formatToFineractDate(value: string): string {
	const date = new Date(value + "T00:00:00");
	if (Number.isNaN(date.getTime())) {
		throw new TypeError("Invalid date value");
	}
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export const parseFineractDateTime = (fineractDateTime: string): Date => {
	// Fineract's format is "YYYY-MM-DD HH:mm:ss.SSSSSS"
	// It is in UTC, so we need to append 'Z' to make it a valid ISO 8601 string
	const isoString = fineractDateTime.replace(" ", "T") + "Z";
	return new Date(isoString);
};

/**
 * Formats a business date string for HTML date input (yyyy-MM-dd format)
 * Handles various input formats like "2025,11,30" or "2025-11-30"
 */
export function formatBusinessDateForInput(dateString: string): string {
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
