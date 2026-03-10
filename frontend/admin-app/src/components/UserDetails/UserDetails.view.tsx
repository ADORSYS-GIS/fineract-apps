import { Button, Card } from "@fineract-apps/ui";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
	const isUserEnabled = keycloakStatus?.keycloak_user?.enabled;

	return (
		<>
			<div className="flex flex-col items-center justify-center p-6">
				<div className="w-full max-w-5xl flex justify-end gap-4 mb-6">
					<Button variant="outline" onClick={onEdit}>
						{t("userDetails.edit")}
					</Button>
					<Button variant="secondary" onClick={openPasswordResetModal}>
						{t("userDetails.resetPassword")}
					</Button>
					<Button
						variant={isUserEnabled ? "destructive" : "default"}
						onClick={() => onUpdateUserStatus(!isUserEnabled)}
					>
						{isUserEnabled
							? t("userDetails.disableUser")
							: t("userDetails.enableUser")}
					</Button>
					<Button variant="secondary" onClick={onForcePasswordChange}>
						{t("userDetails.forcePasswordChange")}
					</Button>
				</div>
				<Card variant="elevated" className="p-8 w-full max-w-5xl">
					<div className="grid grid-cols-2 gap-x-8 gap-y-4">
						<div className="space-y-4">
							<p className="font-medium text-gray-500">
								{t("userDetails.loginName")}
							</p>
							<p className="font-medium text-gray-500">
								{t("userDetails.firstName")}
							</p>
							<p className="font-medium text-gray-500">
								{t("userDetails.lastName")}
							</p>
							<p className="font-medium text-gray-500">
								{t("userDetails.email")}
							</p>
							<p className="font-medium text-gray-500">
								{t("userDetails.office")}
							</p>
							<p className="font-medium text-gray-500">
								{t("userDetails.loanOfficer")}
							</p>
							<p className="font-medium text-gray-500">
								{t("userDetails.mobileNumber")}
							</p>
							<p className="font-medium text-gray-500">
								{t("userDetails.roles")}
							</p>
							<p className="font-medium text-gray-500">
								{t("userDetails.joiningDate")}
							</p>
						</div>
						<div className="space-y-4">
							<p className="text-gray-900">{user.username}</p>
							<p className="text-gray-900">{user.firstname}</p>
							<p className="text-gray-900">{user.lastname}</p>
							<p className="text-gray-900">{user.email}</p>
							<p className="text-gray-900">{user.officeName}</p>
							<p className="text-gray-900">
								{user.loanOfficer ? t("userDetails.yes") : t("userDetails.no")}
							</p>
							<p className="text-gray-900">
								{user.mobileNo ?? t("userDetails.na")}
							</p>
							<p className="text-gray-900">
								{user.selectedRoles?.map((role) => role.name).join(", ") ??
									t("userDetails.na")}
							</p>
							<p className="text-gray-900">
								{user.staff?.joiningDate ?? t("userDetails.na")}
							</p>
						</div>
					</div>
					<div className="mt-8 border-t pt-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">
							{t("userDetails.keycloakStatus")}
						</h3>
						<div className="grid grid-cols-2 gap-x-8 gap-y-4">
							<div className="space-y-4">
								<p className="font-medium text-gray-500">
									{t("userDetails.keycloakId")}
								</p>
								<p className="font-medium text-gray-500">
									{t("userDetails.emailVerified")}
								</p>
								<p className="font-medium text-gray-500">
									{t("userDetails.requiredActions")}
								</p>
							</div>
							<div className="space-y-4">
								<p className="text-gray-900">
									{keycloakStatus?.keycloak_user?.id ?? t("userDetails.na")}
								</p>
								<p className="text-gray-900">
									{keycloakStatus?.keycloak_user?.emailVerified
										? t("userDetails.yes")
										: t("userDetails.no")}
								</p>
								<p className="text-gray-900">
									{keycloakStatus?.keycloak_user?.requiredActions?.join(", ") ??
										t("userDetails.none")}
								</p>
							</div>
						</div>
					</div>
					<div className="mt-8 flex justify-end">
						<Button onClick={onBack}>{t("userDetails.back")}</Button>
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
