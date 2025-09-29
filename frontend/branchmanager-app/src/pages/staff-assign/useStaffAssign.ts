import {
	useTellerCashManagementServiceGetV1Tellers,
	useTellerCashManagementServicePostV1TellersByTellerIdCashiers,
} from "@fineract-apps/fineract-api";
import { useMemo } from "react";
import type { FormValues, TellerOption } from "./StaffAssign.types";

function formatToFineractDate(value: string): string {
	const date = new Date(value + "T00:00:00");
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export function useStaffAssign(staffIdNum: number | null) {
	const { data: tellers, isLoading: isLoadingTellers } =
		useTellerCashManagementServiceGetV1Tellers({}, ["tellers"]);

	const tellerOptions: TellerOption[] = useMemo(() => {
		if (!Array.isArray(tellers)) return [];
		return tellers.filter((t): t is TellerOption => {
			if (typeof t !== "object" || t === null) return false;
			const r = t as { id?: unknown; name?: unknown };
			return typeof r.id === "number";
		});
	}, [tellers]);

	const mutation =
		useTellerCashManagementServicePostV1TellersByTellerIdCashiers();

	const initialValues: FormValues = {
		tellerId: "",
		staffId: String(staffIdNum || ""),
		description: "",
		startDate: "",
		endDate: "",
		isFullDay: true,
	};

	const onSubmit = async (values: FormValues) => {
		const tellerId = Number(values.tellerId);
		await mutation.mutateAsync({
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
	};

	return {
		initialValues,
		tellerOptions,
		isLoadingTellers,
		onSubmit,
		isSubmitting: mutation.isPending,
		error: mutation.error,
		isSuccess: mutation.isSuccess,
	};
}
