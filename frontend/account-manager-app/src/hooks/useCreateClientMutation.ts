import { PostV1ClientsData } from "@fineract-apps/fineract-api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { fineractApi } from "@/services/api";

export const useCreateClientMutation = () => {
	const navigate = useNavigate();

	return useMutation({
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
};
