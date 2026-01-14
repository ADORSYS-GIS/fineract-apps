import {
	OfficesService,
	PostTellersRequest,
	TellerCashManagementService,
} from "@fineract-apps/fineract-api";
import { useBusinessDate } from "@fineract-apps/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
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

export function useTellerCreate() {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: officesData, isLoading: areOfficesLoading } = useQuery({
		queryKey: ["offices"],
		queryFn: () => OfficesService.getV1Offices(),
		staleTime: Infinity,
	});
	const branchManagerOfficeId = officesData?.[0]?.id;
	const { businessDate } = useBusinessDate();

	const initialValues: TellerCreateFormValues = {
		officeId: branchManagerOfficeId ?? 0,
		name: "",
		description: "",
		startDate: businessDate,
		endDate: "",
		status: 300,
	};

	const { mutate, isPending } = useMutation({
		mutationFn: (requestBody: TellerCreationRequestBody) =>
			TellerCashManagementService.postV1Tellers({
				requestBody: requestBody as unknown as PostTellersRequest,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tellers"] });
			toast.success(t("tellerCreate.createdSuccessfully"));
			navigate({ to: "/tellers", search: { page: 1, pageSize: 10, q: "" } });
		},
		onError: () => {
			toast.error(t("tellerCreate.failedToCreate"));
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
			locale: i18n.language,
		};
		mutate(requestBody);
	};

	return {
		initialValues,
		onSubmit,
		isSubmitting: isPending,
		isLoading: areOfficesLoading,
	};
}
