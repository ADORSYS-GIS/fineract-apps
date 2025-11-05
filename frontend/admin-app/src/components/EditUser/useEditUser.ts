import {
	OfficesService,
	RolesService,
	StaffService,
	UsersService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
	UserEditFormValues,
	userEditFormSchema,
} from "@/components/UserForm/userFormSchema";

export const useEditUser = () => {
	const { userId } = useParams({ from: "/users/$userId/edit" });
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: user } = useQuery({
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

	const {
		mutate: updateUser,
		isPending: isUpdatingUser,
		error,
	} = useMutation({
		mutationFn: (updatedUser: UserEditFormValues) =>
			UsersService.putV1UsersByUserId({
				userId: Number.parseInt(userId, 10),
				requestBody: updatedUser,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			navigate({ to: `/users/${userId}` });
		},
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
		officeId: user?.officeId || "",
		staffId: user?.staff?.id || "",
		roles: user?.selectedRoles?.map((role) => role.id) || [],
	};

	const onSubmit = (values: UserEditFormValues) => {
		const updatedUser = userEditFormSchema.parse(values);
		updateUser(updatedUser);
	};

	return {
		initialValues,
		officeOptions,
		staffOptions,
		roleOptions,
		isUpdatingUser,
		onSubmit,
		user,
		error: error?.message,
	};
};
