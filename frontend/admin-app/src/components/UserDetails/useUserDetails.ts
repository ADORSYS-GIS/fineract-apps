import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import { getEmployee } from "@/services/employeeApi";
import {
	forcePasswordChange,
	getUserKeycloakStatus,
	syncUser,
	updateUserStatus,
} from "@/services/userSyncApi";

export const useUserDetails = () => {
	const { userId } = useParams({ from: "/users/$userId/" });
	const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
		useState(false);
	const queryClient = useQueryClient();
	const toast = useToast();
	const { data: user, isLoading } = useQuery({
		queryKey: ["employee", userId],
		queryFn: () => getEmployee(Number.parseInt(userId, 10)),
	});

	const { data: keycloakStatus, isLoading: isKeycloakStatusLoading } = useQuery(
		{
			queryKey: ["keycloakStatus", user?.username],
			queryFn: () => getUserKeycloakStatus(user!.username),
			enabled: !!user?.username,
		},
	);

	const updateUserStatusMutation = useMutation({
		mutationFn: ({
			username,
			enabled,
		}: {
			username: string;
			enabled: boolean;
		}) => updateUserStatus(username, enabled),
		onSuccess: (data) => {
			if (data.status === "success") {
				toast.success(data.message ?? "User status updated successfully.");
				queryClient.invalidateQueries({ queryKey: ["users", userId] });
				queryClient.invalidateQueries({
					queryKey: ["keycloakStatus", user?.username],
				});
			} else {
				toast.error(data.message ?? "An unknown error occurred.");
			}
		},
		onError: (error: Error) => {
			toast.error(error.message ?? "Failed to update user status.");
		},
	});

	const forcePasswordChangeMutation = useMutation({
		mutationFn: (username: string) => forcePasswordChange(username),
		onSuccess: (data) => {
			if (data.status === "success") {
				toast.success(
					data.message ??
						"User will be required to change password on next login.",
				);
				queryClient.invalidateQueries({
					queryKey: ["keycloakStatus", user?.username],
				});
			} else {
				toast.error(data.message ?? "An unknown error occurred.");
			}
		},
		onError: (error: Error) => {
			toast.error(error.message ?? "Failed to force password change.");
		},
	});

	const syncUserMutation = useMutation({
		mutationFn: () =>
			syncUser({
				userId: user!.id,
				username: user!.username,
				email: user!.email,
				firstName: user!.firstname,
				lastName: user!.lastname,
				officeId: user!.officeId,
				officeName: user!.officeName,
				role: user!.selectedRoles?.[0]?.name,
			}),
		onSuccess: (data) => {
			if (data.status === "success") {
				toast.success(data.message ?? "User synced successfully.");
				queryClient.invalidateQueries({
					queryKey: ["keycloakStatus", user?.username],
				});
			} else {
				toast.error(data.message ?? "An unknown error occurred.");
			}
		},
		onError: (error: Error) => {
			toast.error(error.message ?? "Failed to sync user.");
		},
	});

	return {
		user,
		isLoading: isLoading || isKeycloakStatusLoading,
		keycloakStatus,
		isPasswordResetModalOpen,
		openPasswordResetModal: () => setIsPasswordResetModalOpen(true),
		closePasswordResetModal: () => setIsPasswordResetModalOpen(false),
		updateUserStatus: updateUserStatusMutation.mutate,
		forcePasswordChange: forcePasswordChangeMutation.mutate,
		syncUser: syncUserMutation.mutate,
	};
};
