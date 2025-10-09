import {
	OfficesService,
	PostTellersRequest,
	TellerCashManagementService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
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

export function useTellerCreate() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: offices, isLoading: loadingOffices } = useQuery({
		queryKey: ["offices"],
		queryFn: async () => (await OfficesService.getV1Offices({})) ?? [],
	});

	const officeOptions = useMemo(() => {
		if (!Array.isArray(offices))
			return [] as { label: string; value: number }[];
		return offices.map((o) => ({
			label: o.name ?? `Office ${o.id}`,
			value: o.id as number,
		}));
	}, [offices]);

	const initialValues: TellerCreateFormValues = {
		officeId: officeOptions[0]?.value ?? 0,
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
		officeOptions,
		loadingOffices,
		onSubmit,
		isSubmitting: isPending,
		error,
		isSuccess,
	};
}
