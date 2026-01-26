import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWA() {
	const [installPrompt, setInstallPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isInstallable, setIsInstallable] = useState(false);
	const [updateAvailable, setUpdateAvailable] = useState(false);

	useEffect(() => {
		// Check if app is already installed
		const isStandalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as Navigator & { standalone?: boolean }).standalone ===
				true;
		setIsInstalled(isStandalone);

		// Listen for beforeinstallprompt event
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setInstallPrompt(e as BeforeInstallPromptEvent);
			setIsInstallable(true);
		};

		// Listen for app installed event
		const handleAppInstalled = () => {
			setIsInstalled(true);
			setIsInstallable(false);
			setInstallPrompt(null);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);

		// Check for service worker updates
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.ready.then((registration) => {
				registration.addEventListener("updatefound", () => {
					const newWorker = registration.installing;
					if (newWorker) {
						newWorker.addEventListener("statechange", () => {
							if (
								newWorker.state === "installed" &&
								navigator.serviceWorker.controller
							) {
								setUpdateAvailable(true);
							}
						});
					}
				});
			});
		}

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	const promptInstall = useCallback(async () => {
		if (!installPrompt) return false;

		try {
			await installPrompt.prompt();
			const { outcome } = await installPrompt.userChoice;
			setInstallPrompt(null);
			return outcome === "accepted";
		} catch {
			return false;
		}
	}, [installPrompt]);

	const reloadForUpdate = useCallback(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.ready.then((registration) => {
				if (registration.waiting) {
					registration.waiting.postMessage({ type: "SKIP_WAITING" });
				}
			});
			window.location.reload();
		}
	}, []);

	return {
		isInstalled,
		isInstallable,
		promptInstall,
		updateAvailable,
		reloadForUpdate,
	};
}
