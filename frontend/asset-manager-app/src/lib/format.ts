import { i18n } from "@fineract-apps/i18n";

function getLocale(): string {
	const lang = i18n.language ?? "en";
	if (lang.startsWith("fr")) return "fr-FR";
	return "en-US";
}

/**
 * Locale-aware integer-rounded number formatter that follows the active i18n language.
 */
export function formatNumber(value: number): string {
	return new Intl.NumberFormat(getLocale()).format(Math.round(value));
}

/**
 * Locale-aware date formatter for short dates following the active i18n language.
 */
export function formatDate(value: string | number | Date): string {
	const date = value instanceof Date ? value : new Date(value);
	return date.toLocaleDateString(getLocale(), {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}
