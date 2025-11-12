import {
	OfficesService,
	RolesService,
	StaffService,
	UsersService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import {
	UserEditFormValues,
	UserFormValues,
} from "@/components/UserForm/userFormSchema";

export const useEditUser = () => {
	const { userId } = useParams({ from: "/users/$userId/edit" });
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const toast = useToast();
	const [error, setError] = useState<string | null>(null);

	const { data: user, isLoading: isLoadingUser } = useQuery({
		queryKey: ["users", userId],
		queryFn: () =>
			UsersService.getV1UsersByUserId({ userId: Number.parseInt(userId, 10) }),
	});

	const { data: offices } = useQuery({
		queryKey: ["offices"],
		queryFn: () => OfficesService.getV1Offices(),
	});

	const { data: roles } = useQuery({
		queryKey: ["roles"],
		queryFn: () => RolesService.getV1Roles(),
	});

	const { data: staffData } = useQuery({
		queryKey: ["staff"],
		queryFn: () => StaffService.getV1Staff(),
	});

	const { mutateAsync: updateUser, isPending: isUpdatingUser } = useMutation({
		mutationFn: (updatedUser: UserEditFormValues) =>
			UsersService.putV1UsersByUserId({
				userId: Number.parseInt(userId, 10),
				requestBody: {
					...updatedUser,
					roles: [updatedUser.roles],
				},
			}),
	});

	const officeOptions = (offices || []).map((office) => ({
		label: office.name || "",
		value: office.id || 0,
	}));

	const staffOptions =
		staffData?.map((staff) => ({
			label: staff.displayName!,
			value: staff.id!,
		})) || [];

	const roleOptions = (roles || []).map((role) => ({
		label: role.name || "",
		value: role.id || 0,
	}));

	const initialValues = {
		username: user?.username || "",
		firstname: user?.firstname || "",
		lastname: user?.lastname || "",
		email: user?.email || "",
		officeId: user?.officeId || 0,
		staffId: user?.staff?.id || 0,
		roles: user?.selectedRoles?.[0]?.id || 0,
	};

	const onSubmit = async (values: UserFormValues) => {
		setError(null);
		try {
			await updateUser(values);

			toast.success("User updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["users"] });
			navigate({ to: `/users/${userId}` });
		} catch (err: unknown) {
			const errorMessage =
				(err as { body?: { errors?: Array<{ developerMessage?: string }> } })
					.body?.errors?.[0]?.developerMessage ||
				(err instanceof Error ? err.message : null) ||
				"Failed to update user. Please try again.";
			setError(errorMessage);
		}
	};

	return {
		initialValues,
		officeOptions,
		staffOptions,
		roleOptions,
		isUpdatingUser,
		isLoadingUser,
		onSubmit,
		user,
		error,
	};
};
