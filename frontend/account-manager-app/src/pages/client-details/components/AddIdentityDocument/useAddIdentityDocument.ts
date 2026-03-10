import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { z } from "zod";
import { fineractApi } from "@/services/api";
import {
	addIdentityDocumentSchema,
	initialValues,
} from "./AddIdentityDocument.types";

export const useAddIdentityDocument = (onClose: () => void) => {
	const { clientId } = useParams({ from: "/client-details/$clientId" });
	const queryClient = useQueryClient();

	const { mutate: addIdentityDocument, isPending } = useMutation({
		mutationKey: ["addIdentityDocument", clientId],
		mutationFn: (data: z.infer<typeof addIdentityDocumentSchema>) =>
			fineractApi.ClientIdentifierService.postV1ClientsByClientIdIdentifiers({
				clientId: +clientId,
				requestBody: {
					description: data.description,
					documentKey: data.documentKey,
					documentTypeId: Number(data.documentTypeId),
					status: data.status,
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["identifiers", clientId] });
			toast.success("Identity document added successfully!");
			onClose();
		},
		onError: (error) => {
			toast.error(
				error.message ||
					"An error occurred while adding the identity document.",
			);
		},
	});

	const onSubmit = (values: z.infer<typeof addIdentityDocumentSchema>) => {
		addIdentityDocument(values);
	};

	return {
		initialValues,
		onSubmit,
		isPending,
	};
};
