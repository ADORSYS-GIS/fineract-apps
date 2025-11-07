import { Button } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { UserDetailsView } from "./UserDetails.view";
import { useUserDetails } from "./useUserDetails";

export const UserDetails = () => {
	const { user, isLoading, deleteUser } = useUserDetails();
	const navigate = useNavigate();
	const [showConfirm, setShowConfirm] = useState(false);

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
		setShowConfirm(true);
	};

	const confirmDelete = () => {
		if (user.id) {
			deleteUser(user.id, {
				onSuccess: () => {
					setShowConfirm(false);
					navigate({ to: "/users/list" });
				},
			});
		}
	};

	const handleChangePassword = () => {
		// TODO: Implement change password functionality
		console.log("Change password for user", user.id);
	};

	const handleBack = () => {
		navigate({ to: "/users/list" });
	};

	if (showConfirm) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
				<div className="bg-white p-8 rounded-lg shadow-xl">
					<h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
					<p className="mb-4">
						Are you sure you want to delete this user? This action cannot be
						undone.
					</p>
					<div className="flex justify-end gap-4">
						<Button variant="outline" onClick={() => setShowConfirm(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Delete
						</Button>
					</div>
				</div>
			</div>
		);
	}

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
