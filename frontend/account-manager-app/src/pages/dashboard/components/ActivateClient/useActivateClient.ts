import { PostV1ClientsByClientIdData } from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { z } from "zod";
import { fineractApi } from "../../../../services/api";
import {
	ActivateClientProps,
	activateClientValidationSchema,
	initialValues,
} from "./ActivateClient.types";

export const useActivateClient = ({ client, onClose }: ActivateClientProps) => {
	const queryClient = useQueryClient();

	const { mutate: activateClient, isPending: isActivatingClient } = useMutation(
		{
			mutationKey: ["activateClient"],
			mutationFn: (clientData: PostV1ClientsByClientIdData) =>
				fineractApi.clients.postV1ClientsByClientId(clientData),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["clients"] });
				toast.success("Client activated successfully!");
				onClose();
			},
			onError: (error) => {
				toast.error(
					error.message || "An error occurred while activating the client.",
				);
			},
		},
	);

	const onSubmit = (values: z.infer<typeof activateClientValidationSchema>) => {
		if (!client.id) return;
		const requestBody = {
			activationDate: format(new Date(values.activationDate), "dd MMMM yyyy"),
			dateFormat: "dd MMMM yyyy",
			locale: "en",
		};
		activateClient({
			clientId: client.id,
			command: "activate",
			requestBody,
		});
	};

	return {
		initialValues,
		validationSchema: activateClientValidationSchema,
		onSubmit,
		isActivatingClient,
	};
};
