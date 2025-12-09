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
		throw new Error("Invalid date value");
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
