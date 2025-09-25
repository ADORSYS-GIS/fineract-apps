import {
	useTellerCashManagementServiceGetV1Tellers,
	useTellerCashManagementServicePostV1TellersByTellerIdCashiers,
} from "@fineract-apps/fineract-api";
import { Form, FormTitle, Input, SubmitButton } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";

const schema = z.object({
	tellerId: z.string().min(1, "Please choose a teller"),
	staffId: z.string().min(1, "Staff is required"),
	description: z.string().optional(),
	startDate: z.string().min(1, "Start date required"),
	endDate: z.string().min(1, "End date required"),
	isFullDay: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

function formatToFineractDate(value: string): string {
	// value from <input type="date"> is YYYY-MM-DD
	// Convert to "dd MMMM yyyy" with English month name
	const date = new Date(value + "T00:00:00");
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function StaffAssignFormPage() {
	const { staffId } = Route.useParams();
	const staffIdNum = Number(staffId);

	const { data: tellers, isLoading: isLoadingTellers } =
		useTellerCashManagementServiceGetV1Tellers({}, ["tellers"]);

	type TellerOption = { id: number; name?: string };

	const tellerOptions = useMemo(() => {
		if (!Array.isArray(tellers)) {
			return [] as TellerOption[];
		}
		return tellers.filter((item): item is TellerOption => {
			if (typeof item !== "object" || item === null) {
				return false;
			}
			const candidate = item as { id?: unknown; name?: unknown };
			return typeof candidate.id === "number";
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

	return (
		<div className="px-6 py-6">
			<Form<FormValues>
				initialValues={initialValues}
				validationSchema={schema}
				onSubmit={async (values) => {
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
				}}
			>
				<FormTitle>Assign Staff to Teller</FormTitle>
				<div className="grid grid-cols-1 gap-4">
					<Input
						name="tellerId"
						label="Teller"
						type="select"
						disabled={isLoadingTellers}
						options={tellerOptions.map((t) => ({
							value: t.id,
							label: t.name ?? `Teller ${t.id}`,
						}))}
					/>
					<Input
						name="staffId"
						label="Staff ID"
						disabled
						helperText="Prefilled from selected staff"
					/>
					<Input
						name="description"
						label="Description"
						placeholder="Notes (optional)"
					/>
					<Input name="startDate" label="Start date" type="date" />
					<Input name="endDate" label="End date" type="date" />
					<div className="flex items-center gap-3">
						<Input name="isFullDay" type="checkbox" label="Full day" />
					</div>
					<SubmitButton
						label={mutation.isPending ? "Assigning..." : "Assign"}
					/>
				</div>
			</Form>
			{mutation.isError && (
				<div className="mt-4 text-red-600 text-sm">
					Assignment failed. {(mutation.error as Error)?.message}
				</div>
			)}
			{mutation.isSuccess && (
				<div className="mt-4 text-green-700 text-sm">
					Assigned successfully.
				</div>
			)}
		</div>
	);
}

export const Route = createFileRoute("/staff/$staffId/assign")({
	component: StaffAssignFormPage,
});
