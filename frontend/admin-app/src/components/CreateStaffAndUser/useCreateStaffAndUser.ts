import {
	OfficesService,
	type PostUsersRequest,
	type StaffRequest,
	StaffService,
	UsersService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import { syncUser } from "@/services/userSyncApi";
import { type CreateStaffAndUserFormValues } from "./createStaffAndUserFormSchema";

export const useCreateStaffAndUser = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);

	const { data: offices } = useQuery({
		queryKey: ["offices"],
		queryFn: () => OfficesService.getV1Offices(),
	});

	const { data: template } = useQuery({
		queryKey: ["userTemplate"],
		queryFn: () => UsersService.getV1UsersTemplate(),
	});

	const createStaffMutation = useMutation({
		mutationFn: (staffPayload: StaffRequest) =>
			StaffService.postV1Staff({ requestBody: staffPayload }),
	});

	const syncUserMutation = useMutation({
		mutationFn: syncUser,
	});

	const createUserMutation = useMutation({
		mutationFn: (userPayload: PostUsersRequest) =>
			UsersService.postV1Users({ requestBody: userPayload }),
	});

	const officeOptions =
		offices?.map((office) => ({
			label: office.name!,
			value: office.id!,
		})) || [];

	const roleOptions =
		template?.availableRoles?.map((role) => ({
			label: role.name!,
			value: role.id!,
		})) || [];

	const initialValues: CreateStaffAndUserFormValues = {
		firstname: "",
		lastname: "",
		mobileNo: "",
		officeId: 0,
		joiningDate: "",
		isLoanOfficer: false,
		isActive: true,
		username: "",
		email: "",
		roles: 0,
	};

	const onSubmit = async (values: CreateStaffAndUserFormValues) => {
		setError(null);

		try {
			// Step 1: Create Staff in Fineract
			const staffPayload: StaffRequest = {
				firstname: values.firstname,
				lastname: values.lastname,
				mobileNo: values.mobileNo,
				officeId: values.officeId,
				isLoanOfficer: values.isLoanOfficer,
				isActive: values.isActive,
			};

			if (values.joiningDate) {
				staffPayload.joiningDate = values.joiningDate;
				staffPayload.dateFormat = "yyyy-MM-dd";
				staffPayload.locale = "en";
			}

			const staffResponse = await createStaffMutation.mutateAsync(staffPayload);
			const newStaffId = staffResponse.resourceId;

			if (!newStaffId) {
				throw new Error("Failed to create staff member in Fineract.");
			}

			// Step 2: Sync User to Keycloak
			const selectedRole = template?.availableRoles?.find(
				(role) => role.id === Number(values.roles),
			);

			if (!selectedRole) {
				throw new Error("Selected role not found");
			}

			const syncResponse = await syncUserMutation.mutateAsync({
				userId: 0,
				username: values.username,
				email: values.email,
				firstName: values.firstname,
				lastName: values.lastname,
				role: selectedRole.name,
				officeId: values.officeId,
				officeName: offices?.find((o) => o.id === values.officeId)?.name,
			});

			if (syncResponse.status !== "success") {
				throw new Error(
					syncResponse.message || "Failed to sync user to Keycloak",
				);
			}

			const tempPassword = syncResponse.temporary_password;
			if (!tempPassword) {
				throw new Error("No temporary password received from sync service");
			}

			// Step 3: Create User in Fineract
			await createUserMutation.mutateAsync({
				username: values.username,
				firstname: values.firstname,
				lastname: values.lastname,
				email: values.email,
				officeId: values.officeId,
				staffId: newStaffId,
				roles: [values.roles],
				sendPasswordToEmail: false,
				password: tempPassword,
				repeatPassword: tempPassword,
			});

			toast.success(`Staff and user ${values.username} created successfully!`);
			queryClient.invalidateQueries({ queryKey: ["staff"] });
			queryClient.invalidateQueries({ queryKey: ["users"] });
			navigate({ to: "/staff/list" });
		} catch (err: unknown) {
			const errorMessage =
				(err as { body?: { errors?: Array<{ developerMessage?: string }> } })
					.body?.errors?.[0]?.developerMessage ||
				(err instanceof Error ? err.message : null) ||
				"Failed to create staff and user. Please try again.";
			setError(errorMessage);
		}
	};

	return {
		initialValues,
		officeOptions,
		roleOptions,
		isPending:
			createStaffMutation.isPending ||
			syncUserMutation.isPending ||
			createUserMutation.isPending,
		error,
		onSubmit,
	};
};
