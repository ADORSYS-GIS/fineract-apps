import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assetApi } from "@/services/assetApi";

export const useNotifications = () => {
	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => assetApi.getAdminNotifications({ page: 0, size: 10 }),
		select: (res) => res.data.content,
		refetchInterval: 30_000,
		retry: false,
	});

	const { data: unreadCount } = useQuery({
		queryKey: ["notifications-unread-count"],
		queryFn: () => assetApi.getAdminUnreadCount(),
		select: (res) => res.data.unreadCount,
		refetchInterval: 15_000,
		retry: false,
	});

	const markReadMutation = useMutation({
		mutationFn: (id: number) => assetApi.markAdminNotificationRead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({
				queryKey: ["notifications-unread-count"],
			});
		},
	});

	const markAllReadMutation = useMutation({
		mutationFn: () => assetApi.markAllAdminNotificationsRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({
				queryKey: ["notifications-unread-count"],
			});
		},
	});

	return {
		notifications: notifications ?? [],
		unreadCount: unreadCount ?? 0,
		isLoading,
		markRead: (id: number) => markReadMutation.mutate(id),
		markAllRead: () => markAllReadMutation.mutate(),
	};
};
