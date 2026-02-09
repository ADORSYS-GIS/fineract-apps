import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "asset-manager-dark-mode";

export function useDarkMode() {
	const [isDark, setIsDark] = useState(() => {
		try {
			return localStorage.getItem(STORAGE_KEY) === "true";
		} catch {
			return false;
		}
	});

	useEffect(() => {
		const root = document.documentElement;
		if (isDark) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		try {
			localStorage.setItem(STORAGE_KEY, String(isDark));
		} catch {
			// storage unavailable
		}
	}, [isDark]);

	const toggle = useCallback(() => setIsDark((prev) => !prev), []);

	return { isDark, toggle };
}
