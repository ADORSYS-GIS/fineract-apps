import { useTellersServicePostV1Tellers } from "@fineract-apps/fineract-api";
import { useNavigate } from "@tanstack/react-router";
import { TellerCreateFormValues } from "./TellerCreate.types";

export const useTellerCreate = (
	officeOptions: { label: string; value: number }[],
) => {
	const initialValues: TellerCreateFormValues = {
		officeId: officeOptions[0]?.value ?? 0,
		name: "",
		description: "",
		startDate: "",
		endDate: "",
		status: 300,
	};

	const { mutate: createTeller } = usePostTellers();
	const navigate = useNavigate();
	const onSubmit = (values: TellerCreateFormValues) => {
		const getStatus = (status: number) => {
			if (status === 300) return "ACTIVE";
			if (status === 400) return "INACTIVE";
			return "INVALID";
		};
		createTeller({
			body: {
				officeId: values.officeId,
				name: values.name,
				description: values.description,
				startDate: values.startDate,
				status: getStatus(values.status),
				dateFormat: "dd MMMM yyyy",
				locale: "en",
			},
		});
		alert("Teller created successfully");
		navigate({ to: "/tellers" });
	};

	return {
		initialValues,
		officeOptions,
		onSubmit,
	};
};
