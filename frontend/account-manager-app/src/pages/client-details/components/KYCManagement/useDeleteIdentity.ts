import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { fineractApi } from "../../../../services/api";

export const useDeleteIdentity = () => {
	const { clientId } = useParams({ from: "/client-details/$clientId" });
	const queryClient = useQueryClient();

	const { mutate: deleteIdentity, isPending } = useMutation({
		mutationKey: ["deleteIdentity", clientId],
		mutationFn: (identifierId: number) =>
			fineractApi.ClientIdentifierService.deleteV1ClientsByClientIdIdentifiersByIdentifierId(
				{
					clientId: +clientId,
					identifierId,
				},
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["identifiers", clientId] });
			toast.success("Identity document deleted successfully!");
		},
		onError: (error) => {
			toast.error(
				error.message ||
					"An error occurred while deleting the identity document.",
			);
		},
	});

	return {
		deleteIdentity,
		isPending,
	};
};
