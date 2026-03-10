import { z } from "zod";

export const addIdentityDocumentSchema = z.object({
	documentTypeId: z.string().min(1, "Document type is required"),
	status: z.string().min(1, "Status is required"),
	documentKey: z.string().min(1, "Document key is required"),
	description: z.string().optional(),
});

export type AddIdentityDocumentForm = z.infer<typeof addIdentityDocumentSchema>;

export const initialValues: AddIdentityDocumentForm = {
	documentTypeId: "",
	status: "",
	documentKey: "",
	description: "",
};
