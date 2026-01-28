import { ApiError, KycDocumentsService } from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

export interface KycDocumentUploadResponse {
	documentId: string;
	documentType: string;
	status: "uploaded" | "pending" | "verified" | "rejected";
	uploadedAt: string;
}

export interface KycUploadProgress {
	documentType: string;
	progress: number;
	status: "uploading" | "success" | "error";
	error?: string;
}

export function useKycUpload() {
	const auth = useAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			documentType,
			file,
		}: {
			documentType: string;
			file: File;
			// TODO: Add progress tracking back if supported by API client
			// onProgress?: (progress: number) => void;
		}) => {
			if (!auth.user?.access_token) {
				throw new Error("Not authenticated");
			}

			return KycDocumentsService.postApiRegistrationKycDocuments({
				documentType,
				formData: {
					file,
				},
			}) as unknown as KycDocumentUploadResponse;
		},
		onSuccess: () => {
			// Invalidate KYC status to refetch after upload
			queryClient.invalidateQueries({ queryKey: ["kycStatus"] });
		},
	});
}

export function useKycUploadAll() {
	const auth = useAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			documents,
			onDocumentProgress,
		}: {
			documents: { type: string; file: File }[];
			onDocumentProgress?: (
				type: string,
				progress: number,
				status: "uploading" | "success" | "error",
			) => void;
		}) => {
			if (!auth.user?.access_token) {
				throw new Error("Not authenticated");
			}

			const results: KycDocumentUploadResponse[] = [];
			const errors: { type: string; error: string }[] = [];

			for (const doc of documents) {
				try {
					// TODO: Add progress tracking back if supported by API client
					onDocumentProgress?.(doc.type, 0, "uploading");

					const result =
						(await KycDocumentsService.postApiRegistrationKycDocuments({
							documentType: doc.type,
							formData: {
								file: doc.file,
							},
						})) as KycDocumentUploadResponse;

					results.push(result);
					onDocumentProgress?.(doc.type, 100, "success");
				} catch (err) {
					const errorMessage =
						err instanceof ApiError
							? (err.body as { message?: string })?.message || err.message
							: err instanceof Error
								? err.message
								: "Upload failed";
					errors.push({ type: doc.type, error: errorMessage });
					onDocumentProgress?.(doc.type, 0, "error");
				}
			}

			if (errors.length > 0 && results.length === 0) {
				throw new Error(
					`Failed to upload documents: ${errors.map((e) => e.type).join(", ")}`,
				);
			}

			return { results, errors };
		},
		onSuccess: () => {
			// Invalidate KYC status to refetch after upload
			queryClient.invalidateQueries({ queryKey: ["kycStatus"] });
		},
	});
}
