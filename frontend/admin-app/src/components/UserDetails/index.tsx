import { Button, Card } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { UserDetailsView } from "./UserDetails.view";
import { useUserDetails } from "./useUserDetails";

export const UserDetails = () => {
	const {
		user,
		isLoading,
		isPasswordResetModalOpen,
		openPasswordResetModal,
		closePasswordResetModal,
		updateUserStatus,
		keycloakStatus,
		forcePasswordChange,
		syncUser,
	} = useUserDetails();
	const navigate = useNavigate();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <div>User not found</div>;
	}

	if (!keycloakStatus || keycloakStatus.status === "not_found") {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<Card className="w-full max-w-md">
					<div className="p-6 text-center">
						<h2 className="text-xl font-semibold mb-4">User Not Synced</h2>
						<p className="mb-6">This user has not been synced to Keycloak.</p>
						<Button onClick={() => syncUser()}>Complete User Creation</Button>
					</div>
				</Card>
			</div>
		);
	}

	const handleEdit = () => {
		navigate({ to: `/users/${user.id}/edit` });
	};

	const handleBack = () => {
		navigate({ to: "/users/list" });
	};

	return (
		<UserDetailsView
			user={user}
			onEdit={handleEdit}
			onBack={handleBack}
			isPasswordResetModalOpen={isPasswordResetModalOpen}
			openPasswordResetModal={openPasswordResetModal}
			closePasswordResetModal={closePasswordResetModal}
			onUpdateUserStatus={(enabled) =>
				updateUserStatus({ username: user.username, enabled })
			}
			keycloakStatus={keycloakStatus}
			onForcePasswordChange={() => forcePasswordChange(user.username)}
		/>
	);
};
