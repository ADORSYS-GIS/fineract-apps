import { i18n } from "@fineract-apps/i18n";

function getLocale(): string {
	const lang = i18n.language ?? "en";
	if (lang.startsWith("fr")) return "fr-FR";
	return "en-US";
}

/**
 * Locale-aware integer-rounded number formatter following the active i18n
 * language.
 *
 * @remarks
 * Reads `i18n.language` at call time. The calling component must be subscribed
 * to i18n re-renders (e.g. via `useTranslation()`) for output to refresh on
 * language change. Values are rounded via `Math.round` before formatting.
 */
export function formatNumber(value: number): string {
	return new Intl.NumberFormat(getLocale()).format(Math.round(value));
}

/**
 * Locale-aware date formatter for short dates following the active i18n
 * language.
 *
 * @remarks Same i18n re-render contract as {@link formatNumber}.
 */
export function formatDate(value: string | number | Date): string {
	const date = value instanceof Date ? value : new Date(value);
	return date.toLocaleDateString(getLocale(), {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}
