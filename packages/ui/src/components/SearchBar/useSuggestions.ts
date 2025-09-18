import { useEffect, useRef, useState } from "react";
import type { Suggestion } from "./SearchBar.types";

/**
 * Props for the useSuggestions hook
 */
interface UseSuggestionsProps {
	/** The search query to filter/fetch suggestions for */
	query: string;
	/** Optional async function to fetch suggestions from a server */
	suggestionProvider?: (
		query: string,
		signal?: AbortSignal,
	) => Promise<Suggestion[]>;
	/** Optional array of suggestions for client-side filtering */
	externalSuggestions?: Suggestion[];
	/** Maximum number of suggestions to return */
	maxSuggestions: number;
	/** Minimum characters required before fetching suggestions */
	minChars: number;
}

/**
 * Custom hook for managing suggestion fetching and filtering logic.
 * Handles both async suggestion providers and client-side filtering of external suggestions.
 *
 * @param props - Configuration for suggestion handling
 * @returns Object containing filtered suggestions and loading state
 */
export function useSuggestions({
	query,
	suggestionProvider,
	externalSuggestions,
	maxSuggestions,
	minChars,
}: Readonly<UseSuggestionsProps>) {
	const [items, setItems] = useState<Suggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		// Clear suggestions if query is too short or empty
		if (!query || query.length < minChars) {
			setItems([]);
			setIsLoading(false);
			return;
		}

		// Skip if no suggestion source is provided
		if (!suggestionProvider && !externalSuggestions) {
			setItems([]);
			setIsLoading(false);
			return;
		}

		let cancelled = false;

		const fetchSuggestions = async () => {
			setIsLoading(true);

			try {
				let results: Suggestion[] = [];

				if (suggestionProvider) {
					// Cancel any previous async request
					abortRef.current?.abort();
					const abortController = new AbortController();
					abortRef.current = abortController;

					results = await suggestionProvider(query, abortController.signal);
				} else if (externalSuggestions) {
					// Client-side filtering of external suggestions
					const lowerQuery = query.toLowerCase();
					results = externalSuggestions.filter(
						(suggestion) =>
							String(suggestion.label).toLowerCase().includes(lowerQuery) ||
							String(suggestion.id).toLowerCase().includes(lowerQuery),
					);
				}

				// Only update state if the request wasn't cancelled
				if (!cancelled) {
					setItems(results.slice(0, maxSuggestions));
				}
			} catch (error) {
				// Silently handle aborted requests (user cancelled by typing)
				if (error instanceof Error && error.name === "AbortError") {
					return;
				}

				console.error("SearchBar suggestion fetch error:", error);
				if (!cancelled) {
					setItems([]);
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		};

		fetchSuggestions();

		// Cleanup function to cancel ongoing requests
		return () => {
			cancelled = true;
			abortRef.current?.abort();
		};
	}, [
		query,
		suggestionProvider,
		externalSuggestions,
		maxSuggestions,
		minChars,
	]);

	// Cleanup on unmount to prevent memory leaks
	useEffect(() => {
		return () => {
			abortRef.current?.abort();
		};
	}, []);

	return { items, isLoading };
}
