import {
	OfficesService,
	type StaffRequest,
	StaffService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { type StaffFormValues } from "@/components/StaffForm/staffFormSchema";
import { useToast } from "@/components/Toast";

export const useEditStaff = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);
	const { staffId } = useParams({ from: "/staff/$staffId/edit" });

	const { data: staffData, isLoading: isLoadingStaff } = useQuery({
		queryKey: ["staff", staffId],
		queryFn: () =>
			StaffService.getV1StaffByStaffId({ staffId: Number(staffId) }),
	});

	const { data: offices } = useQuery({
		queryKey: ["offices"],
		queryFn: () => OfficesService.getV1Offices(),
	});

	const editStaffMutation = useMutation({
		mutationFn: (staffPayload: StaffRequest) =>
			StaffService.putV1StaffByStaffId({
				staffId: Number(staffId),
				requestBody: staffPayload,
			}),
	});

	const officeOptions =
		offices?.map((office) => ({
			label: office.name!,
			value: office.id!,
		})) || [];

	const initialValues: StaffFormValues = {
		firstname: staffData?.firstname || "",
		lastname: staffData?.lastname || "",
		mobileNo: staffData?.mobileNo || "",
		officeId: staffData?.officeId || 0,
		joiningDate: staffData?.joiningDate
			? new Date(staffData.joiningDate).toISOString().split("T")[0]
			: "",
		isLoanOfficer: staffData?.isLoanOfficer || false,
		isActive: staffData?.isActive || false,
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

			await editStaffMutation.mutateAsync(staffPayload);

			toast.success("Staff updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["staff"] });
			navigate({ to: "/staff/list" });
		} catch (err: unknown) {
			const errorMessage =
				(err as { body?: { errors?: Array<{ developerMessage?: string }> } })
					.body?.errors?.[0]?.developerMessage ||
				(err instanceof Error ? err.message : null) ||
				"Failed to update staff. Please try again.";
			setError(errorMessage);
		}
	};

	return {
		initialValues,
		officeOptions,
		isEditingStaff: editStaffMutation.isPending,
		isLoadingStaff,
		error,
		onSubmit,
	};
};
