import { NotificationCard, useOnClickOutside } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useRef, useState } from "react";
import {
	FineractNotification,
	useNotifications,
} from "@/hooks/useNotifications";

export const NotificationBell = () => {
	const { unreadCount, notifications, markAllAsRead } = useNotifications();
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const ref = useRef<HTMLDivElement>(null);

	const close = () => {
		if (isOpen && unreadCount > 0) {
			markAllAsRead();
		}
		setIsOpen(false);
	};

	useOnClickOutside(ref, close);

	const handleBellClick = () => {
		setIsOpen(!isOpen);
	};

	const handleNotificationClick = (notification: FineractNotification) => {
		const objectType = notification.objectType?.toLowerCase();
		const objectId = notification.objectId;

		if (objectType === "loan") {
			navigate({ to: `/approve/loans/${objectId}` });
		} else if (objectType === "savingsaccount") {
			navigate({
				to: "/approve/savings/account",
				search: { accountId: objectId },
			});
		}

		close();
	};

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={handleBellClick}
				className="relative rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				<Bell className="h-6 w-6" />
				{unreadCount > 0 && (
					<span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
						{unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<div className="border-b px-4 py-2 text-sm font-medium text-gray-900">
							Notifications
						</div>
						{notifications && notifications.length > 0 ? (
							notifications.map((notif) => (
								<NotificationCard
									key={notif.id}
									notification={notif}
									onClick={() => handleNotificationClick(notif)}
								/>
							))
						) : (
							<div className="px-4 py-2 text-sm text-gray-500">
								No new notifications
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
