import {
	StaffService,
	useTellerCashManagementServicePostV1TellersByTellerIdCashiers,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
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

	const mutation =
		useTellerCashManagementServicePostV1TellersByTellerIdCashiers();

	const initialValues: FormValues = {
		tellerId: String(tellerIdNum || ""),
		staffId: "",
		description: "",
		startDate: "",
		endDate: "",
		isFullDay: true,
	};

	const onSubmit = async (values: FormValues) => {
		const tellerId = Number(values.tellerId);
		await mutation.mutateAsync(
			{
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
			},
			{
				onSuccess,
			},
		);
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
