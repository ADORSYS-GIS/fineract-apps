import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assetApi } from "@/services/assetApi";

export const useNotifications = () => {
	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => assetApi.getNotifications({ page: 0, size: 10 }),
		select: (res) => res.data.content,
		refetchInterval: 30_000,
	});

	const { data: unreadCount } = useQuery({
		queryKey: ["notifications-unread-count"],
		queryFn: () => assetApi.getUnreadCount(),
		select: (res) => res.data.count,
		refetchInterval: 15_000,
	});

	const markReadMutation = useMutation({
		mutationFn: (id: number) => assetApi.markNotificationRead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({
				queryKey: ["notifications-unread-count"],
			});
		},
	});

	const markAllReadMutation = useMutation({
		mutationFn: () => assetApi.markAllNotificationsRead(),
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
