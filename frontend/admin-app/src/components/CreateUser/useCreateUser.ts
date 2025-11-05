import {
	type PostUsersRequest,
	StaffService,
	UsersService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import { type UserFormValues } from "@/components/UserForm/userFormSchema";

export const useCreateUser = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);
	const { staffId } = useSearch({ from: "/users/create" });

	const { data: template } = useQuery({
		queryKey: ["userTemplate"],
		queryFn: () => UsersService.getV1UsersTemplate(),
	});

	const { data: staffData } = useQuery({
		queryKey: ["staff"],
		queryFn: () => StaffService.getV1Staff(),
	});

	const createUserMutation = useMutation({
		mutationFn: (userPayload: PostUsersRequest) =>
			UsersService.postV1Users({ requestBody: userPayload }),
	});

	const staffOptions =
		staffData?.map((staff) => ({
			label: staff.displayName!,
			value: staff.id!,
		})) || [];

	const roleOptions =
		template?.availableRoles?.map((role) => ({
			label: role.name!,
			value: role.id!,
		})) || [];

	const initialValues: UserFormValues = {
		username: "",
		firstname: "",
		lastname: "",
		email: "",
		officeId: 0,
		staffId: staffId || 0,
		roles: [],
		sendPasswordToEmail: true,
		password: "",
		repeatPassword: "",
	};

	const onSubmit = async (values: UserFormValues) => {
		setError(null);

		try {
			const selectedStaff = staffData?.find(
				(staff) => staff.id === values.staffId,
			);

			if (!selectedStaff) {
				throw new Error("Selected staff not found");
			}

			await createUserMutation.mutateAsync({
				username: values.username,
				firstname: selectedStaff.firstname,
				lastname: selectedStaff.lastname,
				email: values.email,
				officeId: selectedStaff.officeId,
				staffId: values.staffId,
				roles: values.roles,
				sendPasswordToEmail: values.sendPasswordToEmail,
				password: values.password,
				repeatPassword: values.repeatPassword,
			});

			toast.success("User created successfully!");
			queryClient.invalidateQueries({ queryKey: ["users"] });
			navigate({ to: "/users/list" });
		} catch (err: unknown) {
			const errorMessage =
				(err as { body?: { errors?: Array<{ developerMessage?: string }> } })
					.body?.errors?.[0]?.developerMessage ||
				(err instanceof Error ? err.message : null) ||
				"Failed to create user. Please try again.";
			setError(errorMessage);
		}
	};

	return {
		initialValues,
		staffOptions,
		roleOptions,
		isCreatingUser: createUserMutation.isPending,
		error,
		onSubmit,
	};
};
