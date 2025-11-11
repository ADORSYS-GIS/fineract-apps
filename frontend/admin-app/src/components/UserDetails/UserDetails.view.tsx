import {
	RoleData as Role,
	GetUsersUserIdResponse as User,
} from "@fineract-apps/fineract-api";
import { Button, Card } from "@fineract-apps/ui";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();
	return (
		<div className="flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-5xl flex justify-end gap-4 mb-6">
				<Button variant="outline" onClick={onEdit}>
					{t("edit")}
				</Button>
				<Button variant="destructive" onClick={onDelete}>
					{t("delete")}
				</Button>
				<Button variant="secondary" onClick={onChangePassword}>
					{t("changePassword")}
				</Button>
			</div>
			<Card variant="elevated" className="p-8 w-full max-w-5xl">
				<div className="grid grid-cols-2 gap-x-8 gap-y-4">
					<div className="space-y-4">
						<p className="font-medium text-gray-500">{t("loginName")}</p>
						<p className="font-medium text-gray-500">{t("firstName")}</p>
						<p className="font-medium text-gray-500">{t("lastName")}</p>
						<p className="font-medium text-gray-500">{t("email")}</p>
						<p className="font-medium text-gray-500">{t("office")}</p>
						<p className="font-medium text-gray-500">{t("roles")}</p>
						<p className="font-medium text-gray-500">{t("joiningDate")}</p>
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
					<Button onClick={onBack}>{t("back")}</Button>
				</div>
			</Card>
		</div>
	);
};
