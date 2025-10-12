import {
	PostTellersRequest,
	TellerCashManagementService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import type { TellerCreateFormValues } from "./TellerCreate.types";

type TellerCreationRequestBody = Omit<PostTellersRequest, "status"> & {
	status: number;
};

function formatToFineractDate(value: string): string {
	const date = new Date(value + "T00:00:00");
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

// Cache the branch manager's office ID (assuming it's office ID 1 for now)
// In a real app, this would come from user context/auth
const BRANCH_MANAGER_OFFICE_ID = 1;

export function useTellerCreate() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const initialValues: TellerCreateFormValues = {
		officeId: BRANCH_MANAGER_OFFICE_ID,
		name: "",
		description: "",
		startDate: "",
		endDate: "",
		status: 300,
	};

	const { mutate, isPending, error, isSuccess } = useMutation({
		mutationFn: (requestBody: TellerCreationRequestBody) =>
			TellerCashManagementService.postV1Tellers({
				requestBody: requestBody as unknown as PostTellersRequest,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tellers"] });
			toast.success("Teller created successfully");
			navigate({ to: "/tellers", search: { page: 1, pageSize: 10, q: "" } });
		},
		onError: () => {
			toast.error("Failed to create teller");
		},
	});

	const onSubmit = (values: TellerCreateFormValues) => {
		const requestBody: TellerCreationRequestBody = {
			officeId: Number(values.officeId),
			name: values.name,
			description: values.description ?? "",
			startDate: formatToFineractDate(values.startDate),
			status: values.status,
			dateFormat: "dd MMMM yyyy",
			locale: "en",
		};
		mutate(requestBody);
	};

	return {
		initialValues,
		onSubmit,
		isSubmitting: isPending,
		error,
		isSuccess,
	};
}
