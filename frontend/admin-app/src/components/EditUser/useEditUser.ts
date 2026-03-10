import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import { UserEditFormValues } from "@/components/UserForm/userFormSchema";
import { getEmployee, updateEmployee } from "@/services/employeeApi";
import { Employee } from "@/services/types";

export const useEditUser = () => {
	const { userId } = useParams({ from: "/users/$userId/edit" });
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const toast = useToast();
	const [error, setError] = useState<string | null>(null);

	const { data: user, isLoading: isLoadingUser } = useQuery({
		queryKey: ["employee", userId],
		queryFn: () => getEmployee(Number.parseInt(userId, 10)),
	});

	const { mutateAsync: updateUser, isPending: isUpdatingUser } = useMutation({
		mutationFn: (updatedUser: UserEditFormValues) =>
			updateEmployee(Number.parseInt(userId, 10), {
				firstname: updatedUser.firstname,
				lastname: updatedUser.lastname,
				mobileNo: updatedUser.mobileNo,
				isLoanOfficer: updatedUser.isLoanOfficer ?? false,
				roles: [updatedUser.roles],
				officeId: updatedUser.officeId,
			}),
	});

	const initialValues = {
		firstname: user?.firstname ?? "",
		lastname: user?.lastname ?? "",
		mobileNo: user?.mobileNo ?? "",
		isLoanOfficer: user?.staff?.isLoanOfficer ?? false,
		roles: user?.selectedRoles?.[0]?.id ?? 0,
		officeId: user?.officeId ?? 0,
	};

	const onSubmit = async (values: UserEditFormValues) => {
		setError(null);
		try {
			await updateUser(values);

			toast.success("User updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.setQueryData(
				["employee", userId],
				(oldData: Employee | undefined) =>
					oldData ? { ...oldData, ...values } : undefined,
			);
			navigate({ to: `/users/${userId}` });
		} catch (err: unknown) {
			const errorMessage =
				(err as { body?: { errors?: Array<{ developerMessage?: string }> } })
					.body?.errors?.[0]?.developerMessage ??
				(err instanceof Error ? err.message : null) ??
				"Failed to update user. Please try again.";
			setError(errorMessage);
		}
	};

	return {
		initialValues,
		isUpdatingUser,
		isLoadingUser,
		onSubmit,
		user,
		error,
	};
};
