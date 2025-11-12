import {
	RoleData as Role,
	GetUsersUserIdResponse as User,
} from "@fineract-apps/fineract-api";
import { Button, Card } from "@fineract-apps/ui";

export type UserDetailsViewProps = {
	user: User;
	onEdit: () => void;
	onDelete: () => void;
	onChangePassword: () => void;
	onBack: () => void;
};

export const UserDetailsView = ({
	user,
	onEdit,
	onDelete,
	onChangePassword,
	onBack,
}: UserDetailsViewProps) => {
	return (
		<div className="flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-5xl flex justify-end gap-4 mb-6">
				<Button variant="outline" onClick={onEdit}>
					Edit
				</Button>
				<Button variant="destructive" onClick={onDelete}>
					Delete
				</Button>
				<Button variant="secondary" onClick={onChangePassword}>
					Change Password
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
						<p className="font-medium text-gray-500">Roles</p>
						<p className="font-medium text-gray-500">Joining Date</p>
					</div>
					<div className="space-y-4">
						<p className="text-gray-900">{user.username}</p>
						<p className="text-gray-900">{user.firstname}</p>
						<p className="text-gray-900">{user.lastname}</p>
						<p className="text-gray-900">{user.email}</p>
						<p className="text-gray-900">{user.officeName}</p>
						<p className="text-gray-900">
							{user.selectedRoles?.map((role: Role) => role.name).join(", ")}
						</p>
						<p className="text-gray-900">
							{user.staff?.joiningDate
								? new Date(user.staff.joiningDate).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})
								: "N/A"}
						</p>
					</div>
				</div>
				<div className="mt-8 flex justify-end">
					<Button onClick={onBack}>Back</Button>
				</div>
			</Card>
		</div>
	);
};
