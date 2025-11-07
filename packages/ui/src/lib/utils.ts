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
	if (isNaN(date.getTime())) {
		throw new Error("Invalid date value");
	}
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}
