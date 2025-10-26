import {
	type RoleData,
	useUsersServiceGetV1UsersByUserId,
	useUsersServicePutV1UsersByUserId,
} from "@fineract-apps/fineract-api";
import { Button, Card } from "@fineract-apps/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Edit, KeyRound, Power } from "lucide-react";
import { useState } from "react";
import { PasswordResetModal } from "@/components/PasswordResetModal";
import { useToast } from "@/components/Toast";
import { UserStatusBadge } from "@/components/UserStatusBadge";
import { resetUserPassword, updateUserStatus } from "@/services/userSyncApi";

function UserDetailPage() {
	const { userId } = Route.useParams();
	const navigate = useNavigate();
	const toast = useToast();
	const [error, setError] = useState<string | null>(null);
	const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
		useState(false);
	const [isResettingPassword, setIsResettingPassword] = useState(false);
	const [passwordResetError, setPasswordResetError] = useState<string | null>(
		null,
	);

	// Fetch user details from Fineract API
	const {
		data: user,
		isLoading,
		refetch,
	} = useUsersServiceGetV1UsersByUserId({
		userId: Number(userId),
	});

	// Mutation for updating user (we'll use this for activate/deactivate)
	const updateUserMutation = useUsersServicePutV1UsersByUserId();

	const handleEdit = () => {
		navigate({ to: "/users/$userId/edit", params: { userId } });
	};

	const handleToggleStatus = async () => {
		if (!user) return;

		const isActive = user.available !== false;
		const confirmMessage = isActive
			? "Are you sure you want to deactivate this user?"
			: "Are you sure you want to activate this user?";

		if (!window.confirm(confirmMessage)) return;

		setError(null);

		try {
			// Update status in Fineract
			await updateUserMutation.mutateAsync({
				userId: Number(userId),
				requestBody: {
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email,
					officeId: user.officeId,
					roles: user.selectedRoles?.map((role: RoleData) => role.id) || [],
					available: !isActive,
				},
			});

			// Sync status to Keycloak
			try {
				await updateUserStatus(user.username, !isActive);
			} catch (keycloakErr) {
				console.error("Failed to sync status to Keycloak:", keycloakErr);
				// Don't fail the whole operation if Keycloak sync fails
			}

			// Refresh user data
			await refetch();

			toast.success(
				isActive
					? "User deactivated successfully"
					: "User activated successfully",
			);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to update user status. Please try again.";
			setError(errorMessage);
		}
	};

	const handlePasswordReset = async () => {
		if (!user) return;

		setPasswordResetError(null);
		setIsResettingPassword(true);

		try {
			await resetUserPassword(user.username);

			toast.success(
				`Password reset email sent to ${user.email || user.username}`,
			);
			setIsPasswordResetModalOpen(false);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to send password reset email. Please try again.";
			setPasswordResetError(errorMessage);
		} finally {
			setIsResettingPassword(false);
		}
	};

	const handleBack = () => {
		navigate({ to: "/users" });
	};

	if (isLoading) {
		return (
			<div className="p-6">
				<div className="text-center text-gray-500">Loading user details...</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="p-6">
				<Card variant="elevated">
					<div className="p-8 text-center">
						<p className="text-gray-500">User not found</p>
						<Button onClick={handleBack} variant="outline" className="mt-4">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Users
						</Button>
					</div>
				</Card>
			</div>
		);
	}

	const isActive = user.available !== false;

	return (
		<div className="p-6">
			<div className="mb-6">
				<Button onClick={handleBack} variant="ghost" size="sm" className="mb-4">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Users
				</Button>

				{error && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
						{error}
					</div>
				)}

				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">User Details</h1>
						<p className="text-sm text-gray-600 mt-1">
							View user information and account status
						</p>
					</div>
					<div className="flex items-center gap-3">
						<Button
							onClick={() => setIsPasswordResetModalOpen(true)}
							variant="outline"
							size="default"
						>
							<KeyRound className="w-4 h-4 mr-2" />
							Reset Password
						</Button>
						<Button
							onClick={handleToggleStatus}
							variant={isActive ? "destructive" : "default"}
							size="default"
						>
							<Power className="w-4 h-4 mr-2" />
							{isActive ? "Deactivate" : "Activate"}
						</Button>
						<Button onClick={handleEdit} variant="default" size="default">
							<Edit className="w-4 h-4 mr-2" />
							Edit User
						</Button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* User Information Card */}
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<h2 className="text-lg font-semibold text-gray-800 mb-4">
							User Information
						</h2>
						<dl className="space-y-4">
							<div>
								<dt className="text-sm font-medium text-gray-500">Username</dt>
								<dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">
									First Name
								</dt>
								<dd className="mt-1 text-sm text-gray-900">{user.firstname}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Last Name</dt>
								<dd className="mt-1 text-sm text-gray-900">{user.lastname}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Email</dt>
								<dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Status</dt>
								<dd className="mt-1">
									<UserStatusBadge isActive={isActive} />
								</dd>
							</div>
						</dl>
					</div>
				</Card>

				{/* Assignment Information Card */}
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<h2 className="text-lg font-semibold text-gray-800 mb-4">
							Assignment Information
						</h2>
						<dl className="space-y-4">
							<div>
								<dt className="text-sm font-medium text-gray-500">Office</dt>
								<dd className="mt-1 text-sm text-gray-900">
									{user.officeName || "N/A"}
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Roles</dt>
								<dd className="mt-1">
									{user.selectedRoles && user.selectedRoles.length > 0 ? (
										<div className="flex flex-wrap gap-2">
											{user.selectedRoles.map((role: RoleData) => (
												<span
													key={role.id}
													className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
												>
													{role.name}
												</span>
											))}
										</div>
									) : (
										<span className="text-sm text-gray-500">
											No roles assigned
										</span>
									)}
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Staff ID</dt>
								<dd className="mt-1 text-sm text-gray-900">
									{user.staffId || "N/A"}
								</dd>
							</div>
						</dl>
					</div>
				</Card>
			</div>

			{/* Password Reset Modal */}
			<PasswordResetModal
				isOpen={isPasswordResetModalOpen}
				onClose={() => {
					setIsPasswordResetModalOpen(false);
					setPasswordResetError(null);
				}}
				onConfirm={handlePasswordReset}
				userName={user.username}
				userEmail={user.email}
				isLoading={isResettingPassword}
				error={passwordResetError}
			/>
		</div>
	);
}

export const Route = createFileRoute("/users/$userId/")({
	component: UserDetailPage,
});
