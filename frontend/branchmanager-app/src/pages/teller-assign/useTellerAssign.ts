import {
	TellerCashManagementService,
	useTellerCashManagementServiceGetV1TellersByTellerId,
	useTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplate,
} from "@fineract-apps/fineract-api";
import { getBusinessDate } from "@fineract-apps/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { FormValues, StaffOption } from "./TellerAssign.types";

type TellerTemplate = {
	startDate?: [number, number, number];
	endDate?: [number, number, number];
	isFullDay?: boolean;
	staffOptions?: Array<{
		id: number;
		firstname?: string;
		lastname?: string;
		displayName?: string;
		officeId?: number;
		officeName?: string;
		isLoanOfficer?: boolean;
		isActive?: boolean;
	}>;
};

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
	// Use the generated TanStack Query hook for the template endpoint.
	const { data: template, isLoading: isLoadingStaff } =
		useTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplate(
			{ tellerId: Number(tellerIdNum ?? 0) },
			undefined,
			{ enabled: Boolean(tellerIdNum) },
		);

	const staffOptions: StaffOption[] = useMemo(() => {
		const tpl = template as unknown as TellerTemplate | undefined;
		const items = Array.isArray(tpl?.staffOptions) ? tpl.staffOptions : [];
		return items.filter(
			(s): s is StaffOption =>
				typeof s === "object" &&
				s !== null &&
				typeof (s as { id?: unknown }).id === "number",
		);
	}, [template]);

	const { data: teller } = useTellerCashManagementServiceGetV1TellersByTellerId(
		{ tellerId: Number(tellerIdNum ?? 0) },
		undefined,
		{ enabled: Boolean(tellerIdNum) },
	);

	const queryClient = useQueryClient();

	const [businessDate, setBusinessDate] = useState("");

	useEffect(() => {
		const fetchBusinessDate = async () => {
			const date = await getBusinessDate();
			setBusinessDate(date);
		};
		fetchBusinessDate();
	}, []);

	const mutation = useMutation({
		mutationFn: async (values: FormValues) => {
			const tellerId = Number(values.tellerId);
			// Base payload common to both full-day and partial-day assignments
			const requestBody: Record<string, unknown> = {
				staffId: Number(values.staffId),
				description: values.description ?? "",
				startDate: formatToFineractDate(values.startDate),
				endDate: formatToFineractDate(values.endDate),
				isFullDay: values.isFullDay,
				dateFormat: "dd MMMM yyyy",
				locale: "en",
			};

			// When not full day, convert HH:mm strings into hour/min integer fields required by backend
			if (!values.isFullDay) {
				const parseTime = (t?: string) => {
					if (!t) return null;
					const [hh, mm] = t.split(":").map(Number);
					if (Number.isFinite(hh) && Number.isFinite(mm)) return { hh, mm };
					return null;
				};

				const s = parseTime(values.startTime);
				const e = parseTime(values.endTime);
				if (s && e) {
					requestBody.hourStartTime = s.hh;
					requestBody.minStartTime = s.mm;
					requestBody.hourEndTime = e.hh;
					requestBody.minEndTime = e.mm;
				}
			}

			return TellerCashManagementService.postV1TellersByTellerIdCashiers({
				tellerId,
				requestBody,
			});
		},
		onSuccess: () => {
			// Invalidate the specific teller cashiers template query to refresh eligible staff
			queryClient.invalidateQueries({
				queryKey: [
					"TellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplate",
					{ tellerId: Number(tellerIdNum ?? 0) },
				],
			});
			onSuccess();
		},
		onError: () => {
			// You can add a toast or error feedback here if wanted
		},
	});

	const todayIso = businessDate;

	// Helper to convert [year, month, day] arrays to ISO date string yyyy-mm-dd
	const arrayToIso = (arr: unknown): string | null => {
		if (!Array.isArray(arr) || arr.length < 3) return null;
		const [y, m, d] = arr as [number, number, number];
		if (typeof y !== "number" || typeof m !== "number" || typeof d !== "number")
			return null;
		const mmStr = String(m).padStart(2, "0");
		const ddStr = String(d).padStart(2, "0");
		return `${y}-${mmStr}-${ddStr}`;
	};

	const tpl = template as unknown as TellerTemplate | undefined;
	const templateStart = arrayToIso(tpl?.startDate);
	const templateEnd = arrayToIso(tpl?.endDate);
	const templateIsFullDay =
		typeof tpl?.isFullDay === "boolean" ? tpl.isFullDay : false;

	const initialValues: FormValues = {
		tellerId: String(tellerIdNum ?? ""),
		staffId: "",
		description: "",
		startDate: templateStart ?? todayIso,
		endDate: templateEnd ?? todayIso,
		isFullDay: templateIsFullDay,
		// Initialize time fields to empty strings so inputs remain controlled
		startTime: "",
		endTime: "",
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
		teller,
	};
}
