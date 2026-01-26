import { Wifi as WifiIcon, WifiOff as WifiOffIcon } from "lucide-react";
import { type ElementType, useEffect, useState } from "react";

const WifiOff = WifiOffIcon as ElementType;
const Wifi = WifiIcon as ElementType;

import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineIndicator() {
	const { t } = useTranslation();
	const { isOnline, wasOffline } = useOnlineStatus();
	const [showReconnected, setShowReconnected] = useState(false);

	useEffect(() => {
		if (isOnline && wasOffline) {
			setShowReconnected(true);
			const timer = setTimeout(() => setShowReconnected(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [isOnline, wasOffline]);

	if (isOnline && !showReconnected) {
		return null;
	}

	return (
		<div
			className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
				isOnline ? "bg-green-500 text-white" : "bg-yellow-500 text-yellow-900"
			}`}
		>
			{isOnline ? (
				<>
					<Wifi className="w-4 h-4" />
					<span>{t("pwa.backOnline", "Back online")}</span>
				</>
			) : (
				<>
					<WifiOff className="w-4 h-4" />
					<span>{t("pwa.offline", "You're offline")}</span>
				</>
			)}
		</div>
	);
}
