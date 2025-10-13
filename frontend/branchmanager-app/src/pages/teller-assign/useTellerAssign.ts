import {
	StaffService,
	TellerCashManagementService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type { FormValues, StaffOption } from "./TellerAssign.types";

function formatToFineractDate(value: string): string {
	const date = new Date(value + "T00:00:00");
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export function useTellerAssign(
	tellerIdNum: number | null,
	onSuccess: () => void,
) {
	const { data: staff, isLoading: isLoadingStaff } = useQuery({
		queryKey: ["staff", "all"],
		queryFn: async () =>
			(await StaffService.getV1Staff({ status: "all" })) ?? [],
	});

	const staffOptions: StaffOption[] = useMemo(() => {
		if (!Array.isArray(staff)) return [];
		return staff.filter((s): s is StaffOption => {
			if (typeof s !== "object" || s === null) return false;
			const r = s as { id?: unknown; displayName?: unknown };
			return typeof r.id === "number";
		});
	}, [staff]);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (values: FormValues) => {
			const tellerId = Number(values.tellerId);
			return TellerCashManagementService.postV1TellersByTellerIdCashiers({
				tellerId,
				requestBody: {
					staffId: Number(values.staffId),
					description: values.description ?? "",
					startDate: formatToFineractDate(values.startDate),
					endDate: formatToFineractDate(values.endDate),
					isFullDay: values.isFullDay,
					dateFormat: "dd MMMM yyyy",
					locale: "en",
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tellers"] });
			onSuccess();
		},
		onError: () => {
			// You can add a toast or error feedback here if wanted
		},
	});

	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, "0");
	const dd = String(today.getDate()).padStart(2, "0");
	const todayIso = `${yyyy}-${mm}-${dd}`;

	const initialValues: FormValues = {
		tellerId: String(tellerIdNum || ""),
		staffId: "",
		description: "",
		startDate: todayIso,
		endDate: todayIso,
		isFullDay: true,
	};

	const onSubmit = async (values: FormValues) => {
		await mutation.mutateAsync(values);
	};

	return {
		initialValues,
		staffOptions,
		isLoadingStaff,
		onSubmit,
		isSubmitting: mutation.isPending,
		error: mutation.error,
		isSuccess: mutation.isSuccess,
	};
}
