import { useCallback, useEffect, useState } from "react";

export function useOnlineStatus() {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== "undefined" ? navigator.onLine : true,
	);
	const [wasOffline, setWasOffline] = useState(false);

	const handleOnline = useCallback(() => {
		setIsOnline(true);
		if (wasOffline) {
			// User came back online after being offline
			setWasOffline(false);
		}
	}, [wasOffline]);

	const handleOffline = useCallback(() => {
		setIsOnline(false);
		setWasOffline(true);
	}, []);

	useEffect(() => {
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [handleOnline, handleOffline]);

	return { isOnline, wasOffline };
}
