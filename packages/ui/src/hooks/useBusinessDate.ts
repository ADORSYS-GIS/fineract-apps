import { useEffect, useState } from "react";
import { getBusinessDate } from "../services/businessDateService";

/**
 * Custom hook to fetch and manage business date state
 * Provides a centralized way to get the current business date
 * with loading and error states
 */
export const useBusinessDate = () => {
	const [businessDate, setBusinessDate] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBusinessDate = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const date = await getBusinessDate();
				setBusinessDate(date);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch business date",
				);
				console.error("Failed to fetch business date:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchBusinessDate();
	}, []);

	return {
		businessDate,
		isLoading,
		error,
	};
};
