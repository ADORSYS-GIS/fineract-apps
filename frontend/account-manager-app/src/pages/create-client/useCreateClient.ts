import { PostV1ClientsData } from "@fineract-apps/fineract-api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { z } from "zod";
import { fineractApi } from "../../services/api";
import {
	createClientValidationSchema,
	initialValues,
} from "./CreateClient.types";

export const useCreateClient = () => {
	const navigate = useNavigate();
	const { mutate: createClient, isPending: isCreatingClient } = useMutation({
		mutationKey: ["createClient"],
		mutationFn: (clientData: PostV1ClientsData) =>
			fineractApi.clients.postV1Clients(clientData),
		onSuccess: (data) => {
			toast.success("Client created successfully!");
			navigate({ to: `/client-details/${data.clientId}` });
		},
		onError: (error) => {
			toast.error(
				error.message || "An error occurred while creating the client.",
			);
		},
	});

	const onSubmit = (values: z.infer<typeof createClientValidationSchema>) => {
		const requestBody = {
			...values,
			officeId: 2,
			legalFormId: 1,
			activationDate: values.active
				? format(new Date(), "dd MMMM yyyy")
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
	};
};
