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

async function uploadKycDocument(
	formData: FormData,
	accessToken: string,
	onProgress?: (progress: number) => void,
): Promise<KycDocumentUploadResponse> {
	const apiUrl = import.meta.env.VITE_REGISTRATION_API_URL || "/api";

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", `${apiUrl}/registration/kyc/documents`);
		xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable && onProgress) {
				const percentComplete = Math.round((event.loaded / event.total) * 100);
				onProgress(percentComplete);
			}
		};

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					const response = JSON.parse(xhr.responseText);
					resolve(response);
				} catch {
					resolve({
						documentId: crypto.randomUUID(),
						documentType: formData.get("documentType") as string,
						status: "uploaded",
						uploadedAt: new Date().toISOString(),
					});
				}
			} else {
				let errorMessage = "Failed to upload document";
				try {
					const errorResponse = JSON.parse(xhr.responseText);
					errorMessage = errorResponse.message || errorMessage;
				} catch {
					// Use default error message
				}
				reject(new Error(errorMessage));
			}
		};

		xhr.onerror = () => {
			reject(new Error("Network error occurred during upload"));
		};

		xhr.send(formData);
	});
}

export function useKycUpload() {
	const auth = useAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			documentType,
			file,
			onProgress,
		}: {
			documentType: string;
			file: File;
			onProgress?: (progress: number) => void;
		}) => {
			if (!auth.user?.access_token) {
				throw new Error("Not authenticated");
			}

			const formData = new FormData();
			formData.append("documentType", documentType);
			formData.append("file", file);

			return uploadKycDocument(formData, auth.user.access_token, onProgress);
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
					onDocumentProgress?.(doc.type, 0, "uploading");

					const formData = new FormData();
					formData.append("documentType", doc.type);
					formData.append("file", doc.file);

					const result = await uploadKycDocument(
						formData,
						auth.user.access_token,
						(progress) => onDocumentProgress?.(doc.type, progress, "uploading"),
					);

					results.push(result);
					onDocumentProgress?.(doc.type, 100, "success");
				} catch (err) {
					const errorMessage =
						err instanceof Error ? err.message : "Upload failed";
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
