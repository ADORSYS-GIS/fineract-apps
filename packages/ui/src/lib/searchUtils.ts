/**
 * Utility functions for search functionality
 */

/**
 * Debounces a function call
 */
// biome-ignore lint/suspicious/noExplicitAny: Generic debounce function needs flexible typing
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
}

/**
 * Filters an array of items based on a search query
 */
export function filterByQuery<T>(
	items: T[],
	query: string,
	getSearchText: (item: T) => string,
): T[] {
	if (!query.trim()) return items;

	const lowercaseQuery = query.toLowerCase();
	return items.filter((item) =>
		getSearchText(item).toLowerCase().includes(lowercaseQuery),
	);
}

/**
 * Limits the number of items in an array
 */
export function limitResults<T>(items: T[], maxResults: number): T[] {
	return items.slice(0, maxResults);
}

/**
 * Checks if an error should be ignored (like AbortError)
 */
export function shouldIgnoreError(error: unknown): boolean {
	return error instanceof Error && error.name === "AbortError";
}
