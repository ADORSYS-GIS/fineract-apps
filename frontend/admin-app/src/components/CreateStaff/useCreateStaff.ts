import {
	OfficesService,
	type StaffRequest,
	StaffService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { type StaffFormValues } from "@/components/StaffForm/staffFormSchema";
import { useToast } from "@/components/Toast";

export const useCreateStaff = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);

	const { data: offices } = useQuery({
		queryKey: ["offices"],
		queryFn: () => OfficesService.getV1Offices(),
	});

	const createStaffMutation = useMutation({
		mutationFn: (staffPayload: StaffRequest) =>
			StaffService.postV1Staff({ requestBody: staffPayload }),
	});

	const officeOptions =
		offices?.map((office) => ({
			label: office.name!,
			value: office.id!,
		})) || [];

	const initialValues: StaffFormValues = {
		firstname: "",
		lastname: "",
		mobileNo: "",
		officeId: 0,
		joiningDate: "",
		isLoanOfficer: false,
		isActive: true,
	};

	const onSubmit = async (values: StaffFormValues) => {
		setError(null);

		try {
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

			await createStaffMutation.mutateAsync(staffPayload);

			toast.success("Staff created successfully!");
			queryClient.invalidateQueries({ queryKey: ["staff"] });
			navigate({ to: "/staff/list" });
		} catch (err: unknown) {
			const errorMessage =
				(err as { body?: { errors?: Array<{ developerMessage?: string }> } })
					.body?.errors?.[0]?.developerMessage ||
				(err instanceof Error ? err.message : null) ||
				"Failed to create staff. Please try again.";
			setError(errorMessage);
		}
	};

	return {
		initialValues,
		officeOptions,
		isCreatingStaff: createStaffMutation.isPending,
		error,
		onSubmit,
	};
};
