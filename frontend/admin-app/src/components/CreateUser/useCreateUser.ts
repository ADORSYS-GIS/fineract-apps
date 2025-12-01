import { OfficesService, RolesService } from "@fineract-apps/fineract-api";
import { getBusinessDate } from "@fineract-apps/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { CreateUserFormValues } from "@/components/CreateUser/createUserFormSchema";
import { useToast } from "@/components/Toast";
import { CreateEmployeePayload, createEmployee } from "@/services/employeeApi";
import { SyncUserPayload, syncUser } from "@/services/userSyncApi";

// State to manage the two-step process
interface CreationStep {
	step: "form" | "confirm";
	newUser?: {
		fineractResourceId: number;
		username: string;
		email: string;
		firstname: string;
		lastname: string;
		officeId: number;
		roles: number[];
	};
	tempPassword?: string;
}

export const useCreateUser = () => {
	const [creationStep, setCreationStep] = useState<CreationStep>({
		step: "form",
	});
	const [businessDate, setBusinessDate] = useState("");

	useEffect(() => {
		const fetchBusinessDate = async () => {
			const date = await getBusinessDate();
			setBusinessDate(date);
		};
		fetchBusinessDate();
	}, []);

	const navigate = useNavigate();
	const { success, error } = useToast();
	const queryClient = useQueryClient();

	const initialValues: CreateUserFormValues = {
		officeId: 0,
		firstname: "",
		lastname: "",
		username: "",
		email: "",
		roles: 0,
		isLoanOfficer: false,
		mobileNo: "",
		joiningDate: businessDate,
	};

	// Mutation to create the employee in Fineract
	const createEmployeeMutation = useMutation({
		mutationFn: createEmployee,
		onSuccess: (data, variables) => {
			success("Employee Created Successfully");
			setCreationStep({
				step: "confirm",
				newUser: {
					fineractResourceId: data.resourceId!,
					username: variables.username,
					email: variables.email,
					firstname: variables.firstname,
					lastname: variables.lastname,
					officeId: variables.officeId,
					roles: variables.roles,
				},
			});
		},
		onError: (err: { defaultUserMessage?: string }) => {
			error(err.defaultUserMessage ?? "Failed to create employee.");
		},
	});

	// Mutation to sync the user to Keycloak
	const syncUserMutation = useMutation({
		mutationFn: syncUser,
		onSuccess: () => {
			success("User Synced to Keycloak");
			queryClient.invalidateQueries({ queryKey: ["users"] });
			navigate({ to: "/users/list" });
		},
		onError: (err: { defaultUserMessage?: string }) => {
			error(err.defaultUserMessage ?? "Failed to sync user to Keycloak.");
		},
	});

	const onSubmit = async (
		values: CreateUserFormValues,
		{ setSubmitting }: FormikHelpers<CreateUserFormValues>,
	) => {
		const [year, , day] = values.joiningDate.split("-");
		const joiningDate = `${day} ${new Date(values.joiningDate).toLocaleString(
			"default",
			{ month: "long" },
		)} ${year}`;

		const payload: CreateEmployeePayload = {
			...values,
			joiningDate,
			isLoanOfficer: values.isLoanOfficer ?? false,
			roles: [values.roles],
		};
		try {
			await createEmployeeMutation.mutateAsync(payload);
		} catch {
			// Error is handled by the onError callback in useMutation
		} finally {
			setSubmitting(false);
		}
	};

	const onConfirmSync = async () => {
		if (!creationStep.newUser) return;

		// This logic needs to align with backend expectations.
		// Assuming we send the first role name. A better approach
		// would be to have a proper mapping or backend adjustment.
		const roles = await queryClient.fetchQuery({
			queryKey: ["roles"],
			queryFn: () => RolesService.getV1Roles(),
		});
		const office = await queryClient.fetchQuery({
			queryKey: ["offices"],
			queryFn: () => OfficesService.getV1Offices(),
		});

		const primaryRole = roles.find(
			(r) => r.id === creationStep.newUser!.roles[0],
		);
		const officeName = office.find(
			(o) => o.id === creationStep.newUser!.officeId,
		)?.name;

		const payload: SyncUserPayload = {
			userId: creationStep.newUser.fineractResourceId,
			username: creationStep.newUser.username,
			email: creationStep.newUser.email,
			firstName: creationStep.newUser.firstname,
			lastName: creationStep.newUser.lastname,
			officeId: creationStep.newUser.officeId,
			officeName: officeName,
			role: primaryRole?.name,
		};
		syncUserMutation.mutate(payload);
	};

	return {
		initialValues,
		onSubmit,
		onConfirmSync,
		creationStep,
		isLoading: createEmployeeMutation.isPending || syncUserMutation.isPending,
	};
};
