import {
	useOfficesServiceGetV1Offices,
	useTellerCashManagementServicePostV1Tellers,
} from "@fineract-apps/fineract-api";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import type { TellerCreateFormValues } from "./TellerCreate.types";

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
	const { data: offices, isLoading: loadingOffices } =
		useOfficesServiceGetV1Offices({}, ["offices"]);

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

	const { mutateAsync, isPending, error, isSuccess } =
		useTellerCashManagementServicePostV1Tellers();

	const onSubmit = async (values: TellerCreateFormValues) => {
		await mutateAsync({
			requestBody: {
				officeId: Number(values.officeId),
				name: values.name,
				description: values.description ?? "",
				startDate: formatToFineractDate(values.startDate),
				endDate: formatToFineractDate(values.endDate),
				status: Number(values.status),
				dateFormat: "dd MMMM yyyy",
				locale: "en",
			},
		});
		alert("Teller created successfully");
		navigate({ to: "/tellers/" });
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
