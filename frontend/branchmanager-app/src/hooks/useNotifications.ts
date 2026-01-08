import {
	GetNotificationsResponse,
	NotificationService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type { GetNotification as FineractNotification } from "@fineract-apps/fineract-api";

export const useNotifications = () => {
	const queryClient = useQueryClient();

	const { data: notificationsResponse, isLoading } =
		useQuery<GetNotificationsResponse>({
			queryKey: ["notifications"],
			queryFn: () => NotificationService.getV1Notifications(),
			refetchInterval: 60000,
		});

	const unreadCount =
		notificationsResponse?.pageItems?.filter((notif) => !notif.isRead).length ??
		0;

	const markAsReadMutation = useMutation({
		mutationFn: () => NotificationService.putV1Notifications(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	return {
		unreadCount,
		notifications: notificationsResponse?.pageItems ?? [],
		isLoading,
		markAllAsRead: markAsReadMutation.mutate,
	};
};
