import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { cn, parseFineractDateTime } from "../../lib/utils";
import { NotificationCardProps } from "./NotificationCard.types";

export const NotificationCardView: React.FC<NotificationCardProps> = ({
	notification,
	onClick,
}) => {
	const timeAgo = notification.createdAt
		? formatDistanceToNow(parseFineractDateTime(notification.createdAt), {
				addSuffix: true,
			})
		: "No date";

	return (
		<div
			role="button"
			tabIndex={0}
			className={cn(
				"flex items-start gap-3 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50",
				{ "bg-blue-50": !notification.isRead },
			)}
			onClick={() => onClick(notification)}
			onKeyDown={(e) => e.key === "Enter" && onClick(notification)}
		>
			<div className="flex-shrink-0">
				<Bell className="w-6 h-6 text-gray-500" />
			</div>
			<div className="flex-grow">
				<p className="text-sm text-gray-800">
					{notification.content || "No content"}
				</p>
				<p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
			</div>
			{!notification.isRead && (
				<div className="flex-shrink-0 self-center">
					<div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
				</div>
			)}
		</div>
	);
};
