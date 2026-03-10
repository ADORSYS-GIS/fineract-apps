export interface NotificationCardProps {
	notification: {
		id?: number;
		content?: string;
		createdAt?: string;
		isRead?: boolean;
		objectId?: number;
		objectType?: string;
	};
	onClick: (notification: NotificationCardProps["notification"]) => void;
}
