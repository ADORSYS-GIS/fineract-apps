import { useNavigate } from "@tanstack/react-router";
import { UserDetailsView } from "./UserDetails.view";
import { useUserDetails } from "./useUserDetails";

export const UserDetails = () => {
	const { user, isLoading } = useUserDetails();
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

	const handleDelete = () => {
		// TODO: Implement delete functionality
		console.log("Delete user", user.id);
	};

	const handleChangePassword = () => {
		// TODO: Implement change password functionality
		console.log("Change password for user", user.id);
	};

	const handleBack = () => {
		navigate({ to: "/users" });
	};

	return (
		<UserDetailsView
			user={user}
			onEdit={handleEdit}
			onDelete={handleDelete}
			onChangePassword={handleChangePassword}
			onBack={handleBack}
		/>
	);
};
