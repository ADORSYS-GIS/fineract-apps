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
	} = useUserDetails();
	const navigate = useNavigate();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <div>User not found</div>;
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
				updateUserStatus({ username: user.username!, enabled })
			}
			keycloakStatus={keycloakStatus}
			onForcePasswordChange={() => forcePasswordChange(user.username!)}
		/>
	);
};
