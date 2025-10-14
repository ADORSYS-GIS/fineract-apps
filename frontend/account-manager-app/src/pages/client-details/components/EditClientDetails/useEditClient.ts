import { PutV1ClientsByClientIdData } from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { z } from "zod";
import { fineractApi } from "../../../../services/api";
import {
	editClientValidationSchema,
	initialValues,
} from "./EditClientDetails.types";

export const useEditClient = (onClose: () => void) => {
	const { clientId } = useParams({ from: "/client-details/$clientId" });
	const queryClient = useQueryClient();
	const { mutate: editClient, isPending: isEditingClient } = useMutation({
		mutationKey: ["editClient", clientId],
		mutationFn: (clientData: PutV1ClientsByClientIdData) =>
			fineractApi.clients.putV1ClientsByClientId(clientData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["client", clientId] });
			onClose();
		},
	});

	const onSubmit = (values: z.infer<typeof editClientValidationSchema>) => {
		const requestBody = {
			...values,
		} as PutV1ClientsByClientIdData["requestBody"];
		editClient({ clientId: +clientId, requestBody });
	};

	return {
		initialValues,
		validationSchema: editClientValidationSchema,
		onSubmit,
		isEditingClient,
	};
};
