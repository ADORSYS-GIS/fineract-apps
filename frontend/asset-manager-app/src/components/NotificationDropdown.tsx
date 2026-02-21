import { Bell, Check, CheckCheck } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";

const EVENT_TYPE_LABELS: Record<string, string> = {
	TRADE_EXECUTED: "Trade",
	COUPON_PAID: "Coupon",
	REDEMPTION_COMPLETED: "Redemption",
	ASSET_STATUS_CHANGED: "Status Change",
	ORDER_STUCK: "Order Alert",
	INCOME_PAID: "Income",
	TREASURY_SHORTFALL: "Treasury",
	DELISTING_ANNOUNCED: "Delisting",
};

export const NotificationDropdown: FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { notifications, unreadCount, isLoading, markRead, markAllRead } =
		useNotifications();

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={dropdownRef} className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
				aria-label="Notifications"
			>
				<Bell className="w-5 h-5" />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 min-w-4 flex items-center justify-center px-1">
						{unreadCount > 99 ? "99+" : unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden flex flex-col">
					<div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
						<h3 className="text-sm font-semibold text-gray-900 dark:text-white">
							Notifications
						</h3>
						{unreadCount > 0 && (
							<button
								onClick={() => markAllRead()}
								className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
							>
								<CheckCheck className="h-3 w-3" />
								Mark all read
							</button>
						)}
					</div>

					<div className="overflow-y-auto flex-1">
						{isLoading ? (
							<div className="flex justify-center py-6">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
							</div>
						) : notifications.length === 0 ? (
							<p className="text-sm text-gray-500 text-center py-6">
								No notifications
							</p>
						) : (
							notifications.map((n) => (
								<div
									key={n.id}
									className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 ${
										!n.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
									}`}
									onClick={() => {
										if (!n.read) markRead(n.id);
									}}
								>
									<div className="flex justify-between items-start">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
													{EVENT_TYPE_LABELS[n.eventType] ?? n.eventType}
												</span>
												{!n.read && (
													<span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
												)}
											</div>
											<p className="text-sm font-medium text-gray-900 dark:text-white mt-1 truncate">
												{n.title}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
												{n.body}
											</p>
										</div>
										{!n.read && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													markRead(n.id);
												}}
												className="ml-2 p-1 text-gray-400 hover:text-blue-600 flex-shrink-0"
												title="Mark as read"
											>
												<Check className="h-3.5 w-3.5" />
											</button>
										)}
									</div>
									<p className="text-xs text-gray-400 mt-1">
										{new Date(n.createdAt).toLocaleString()}
									</p>
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};
