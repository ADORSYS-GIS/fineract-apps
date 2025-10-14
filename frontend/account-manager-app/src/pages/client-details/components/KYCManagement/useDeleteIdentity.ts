import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
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
		},
	});

	return {
		deleteIdentity,
		isPending,
	};
};
