import {
	DefaultService,
	PostV1ByEntityByEntityIdImagesData,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { fineractApi } from "../../../services/api";

const blobToDataURL = (blob: Blob): Promise<string | null> => {
	return new Promise((resolve) => {
		if (!blob || blob.size === 0) {
			resolve(null);
			return;
		}
		const reader = new FileReader();
		reader.onloadend = () => {
			resolve(reader.result as string);
		};
		reader.onerror = () => {
			resolve(null);
		};
		reader.readAsDataURL(blob);
	});
};

export const useGetClientImage = (clientId: string) => {
	return useQuery<string | null, Error>({
		queryKey: ["clientImage", clientId],
		queryFn: async () => {
			try {
				const response = await DefaultService.getV1ByEntityByEntityIdImages({
					entity: "clients",
					entityId: Number(clientId),
				});

				if (typeof response === "string") {
					if (response.startsWith("data:image")) {
						return response;
					}
					return `data:image/png;base64,${response}`;
				}

				if (response instanceof Blob) {
					if (response.type.startsWith("image/")) {
						return await blobToDataURL(response);
					} else {
						// It might be a JSON error response in a blob
						const text = await response.text();
						try {
							const json = JSON.parse(text);
							if (json.status === 404) {
								return null; // No image found
							}
							throw new Error(json.developerMessage || "Invalid response");
						} catch (_e) {
							// Not a JSON response, and not an image.
							return null;
						}
					}
				}
				return null;
			} catch (error) {
				if (error instanceof Response && error.status === 404) {
					return null;
				}
				throw error;
			}
		},
		enabled: !!clientId,
		staleTime: Infinity,
	});
};

export const useUploadClientImage = (onSuccess?: () => void) => {
	const { clientId } = useParams({ from: "/client-details/$clientId" });
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["uploadClientImage", clientId],
		mutationFn: (file: File) =>
			fineractApi.default.postV1ByEntityByEntityIdImages({
				entity: "clients",
				entityId: Number(clientId),
				formData: {
					file,
				} as PostV1ByEntityByEntityIdImagesData["formData"],
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["clientImage", clientId],
			});
			toast.success("Image uploaded successfully!");
			onSuccess?.();
		},
		onError: (error) => {
			toast.error(
				error.message || "An error occurred while uploading the image.",
			);
		},
	});
};

export const useDeleteClientImage = () => {
	const { clientId } = useParams({ from: "/client-details/$clientId" });
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteClientImage", clientId],
		mutationFn: () =>
			fineractApi.default.deleteV1ByEntityByEntityIdImages({
				entity: "clients",
				entityId: Number(clientId),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clientImage", clientId] });
			toast.success("Image deleted successfully!");
		},
		onError: (error) => {
			toast.error(
				error.message || "An error occurred while deleting the image.",
			);
		},
	});
};
