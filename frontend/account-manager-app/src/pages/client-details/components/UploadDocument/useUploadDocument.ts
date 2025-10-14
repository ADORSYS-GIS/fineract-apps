import { PostV1ByEntityTypeByEntityIdDocumentsData } from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { z } from "zod";
import { fineractApi } from "../../../../services/api";
import { initialValues, uploadDocumentSchema } from "./UploadDocument.types";

export const useUploadDocument = (identityId: number, onClose: () => void) => {
	const { clientId } = useParams({ from: "/client-details/$clientId" });
	const queryClient = useQueryClient();

	const { mutate: uploadDocument, isPending } = useMutation({
		mutationKey: ["uploadDocument", clientId, identityId],
		mutationFn: (data: z.infer<typeof uploadDocumentSchema>) =>
			fineractApi.DocumentsService.postV1ByEntityTypeByEntityIdDocuments({
				entityType: "client_identifiers",
				entityId: identityId,
				formData: {
					file: data.file,
					name: data.name,
					description: data.description,
				} as PostV1ByEntityTypeByEntityIdDocumentsData["formData"],
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["identifiers", clientId],
			});
			queryClient.invalidateQueries({
				queryKey: ["identifier-documents", identityId],
			});
			toast.success("Document uploaded successfully!");
			onClose();
		},
		onError: (error) => {
			toast.error(
				error.message || "An error occurred while uploading the document.",
			);
		},
	});

	const onSubmit = (values: z.infer<typeof uploadDocumentSchema>) => {
		uploadDocument(values);
	};

	return {
		initialValues,
		onSubmit,
		isPending,
	};
};
