import { Button, Card } from "@fineract-apps/ui";
import { PasswordResetModal } from "@/components/PasswordResetModal";
import { Employee } from "@/services/types";
import { KeycloakStatusResponse } from "@/services/userSyncApi";

export type UserDetailsViewProps = {
	user: Employee;
	onEdit: () => void;
	onBack: () => void;
	isPasswordResetModalOpen: boolean;
	openPasswordResetModal: () => void;
	closePasswordResetModal: () => void;
	onUpdateUserStatus: (enabled: boolean) => void;
	keycloakStatus: KeycloakStatusResponse | undefined;
	onForcePasswordChange: () => void;
};

export const UserDetailsView = ({
	user,
	onEdit,
	onBack,
	isPasswordResetModalOpen,
	openPasswordResetModal,
	closePasswordResetModal,
	onUpdateUserStatus,
	keycloakStatus,
	onForcePasswordChange,
}: UserDetailsViewProps) => {
	const isUserEnabled = keycloakStatus?.keycloak_user?.enabled;

	return (
		<>
			<div className="flex flex-col items-center justify-center p-6">
				<div className="w-full max-w-5xl flex justify-end gap-4 mb-6">
					<Button variant="outline" onClick={onEdit}>
						Edit
					</Button>
					<Button variant="secondary" onClick={openPasswordResetModal}>
						Reset Password
					</Button>
					<Button
						variant={isUserEnabled ? "destructive" : "default"}
						onClick={() => onUpdateUserStatus(!isUserEnabled)}
					>
						{isUserEnabled ? "Disable User" : "Enable User"}
					</Button>
					<Button variant="secondary" onClick={onForcePasswordChange}>
						Force Password Change
					</Button>
				</div>
				<Card variant="elevated" className="p-8 w-full max-w-5xl">
					<div className="grid grid-cols-2 gap-x-8 gap-y-4">
						<div className="space-y-4">
							<p className="font-medium text-gray-500">Login Name</p>
							<p className="font-medium text-gray-500">First Name</p>
							<p className="font-medium text-gray-500">Last Name</p>
							<p className="font-medium text-gray-500">Email</p>
							<p className="font-medium text-gray-500">Office</p>
							<p className="font-medium text-gray-500">Loan Officer</p>
							<p className="font-medium text-gray-500">Mobile Number</p>
							<p className="font-medium text-gray-500">Roles</p>
							<p className="font-medium text-gray-500">Joining Date</p>
						</div>
						<div className="space-y-4">
							<p className="text-gray-900">{user.username}</p>
							<p className="text-gray-900">{user.firstname}</p>
							<p className="text-gray-900">{user.lastname}</p>
							<p className="text-gray-900">{user.email}</p>
							<p className="text-gray-900">{user.officeName}</p>
							<p className="text-gray-900">{user.loanOfficer ? "Yes" : "No"}</p>
							<p className="text-gray-900">{user.mobileNo ?? "N/A"}</p>
							<p className="text-gray-900">
								{user.selectedRoles?.map((role) => role.name).join(", ") ??
									"N/A"}
							</p>
							<p className="text-gray-900">
								{user.staff?.joiningDate ?? "N/A"}
							</p>
						</div>
					</div>
					<div className="mt-8 border-t pt-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							Keycloak Status
						</h3>
						<div className="grid grid-cols-2 gap-x-8 gap-y-4">
							<div className="space-y-4">
								<p className="font-medium text-gray-500">Keycloak ID</p>
								<p className="font-medium text-gray-500">Email Verified</p>
								<p className="font-medium text-gray-500">Required Actions</p>
							</div>
							<div className="space-y-4">
								<p className="text-gray-900">
									{keycloakStatus?.keycloak_user?.id ?? "N/A"}
								</p>
								<p className="text-gray-900">
									{keycloakStatus?.keycloak_user?.emailVerified ? "Yes" : "No"}
								</p>
								<p className="text-gray-900">
									{keycloakStatus?.keycloak_user?.requiredActions?.join(", ") ??
										"None"}
								</p>
							</div>
						</div>
					</div>
					<div className="mt-8 flex justify-end">
						<Button onClick={onBack}>Back</Button>
					</div>
				</Card>
			</div>
			<PasswordResetModal
				isOpen={isPasswordResetModalOpen}
				onClose={closePasswordResetModal}
				userName={user.username}
				userEmail={user.email}
			/>
		</>
	);
};
