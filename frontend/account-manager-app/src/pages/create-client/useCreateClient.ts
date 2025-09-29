import { PostV1ClientsData } from "@fineract-apps/fineract-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { z } from "zod";
import { fineractApi } from "../../services/api";
import {
	createClientValidationSchema,
	initialValues,
} from "./CreateClient.types";

export const useCreateClient = () => {
	const navigate = useNavigate();
	const { data: offices } = useQuery({
		queryKey: ["offices"],
		queryFn: () =>
			fineractApi.offices.getV1Offices({ includeAllOffices: true }),
	});
	const { mutate: createClient, isPending: isCreatingClient } = useMutation({
		mutationKey: ["createClient"],
		mutationFn: (clientData: PostV1ClientsData) =>
			fineractApi.clients.postV1Clients(clientData),
		onSuccess: () => {
			// Ideally, show a success notification
			navigate({ to: "/dashboard" });
		},
	});

	const onSubmit = (values: z.infer<typeof createClientValidationSchema>) => {
		const requestBody = {
			...values,
			officeId: Number(values.officeId),
			legalFormId: 1,
			activationDate: values.activationDate
				? format(new Date(values.activationDate), "dd MMMM yyyy")
				: undefined,
			dateFormat: "dd MMMM yyyy",
			locale: "en",
		};
		createClient({ requestBody });
	};

	return {
		initialValues,
		validationSchema: createClientValidationSchema,
		onSubmit,
		isCreatingClient,
		offices,
	};
};
