import { z } from "zod";

export const uploadDocumentSchema = z.object({
	name: z.string().min(1, "Document name is required"),
	description: z.string().optional(),
	file: z.any(),
});

export type UploadDocumentForm = z.infer<typeof uploadDocumentSchema>;

export const initialValues: UploadDocumentForm = {
	name: "",
	description: "",
	file: null,
};
