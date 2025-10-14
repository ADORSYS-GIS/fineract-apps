import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { fineractApi } from "../../../../services/api";

export const useKYCManagement = () => {
	const { clientId } = useParams({ from: "/client-details/$clientId" });

	const { data: identifiers, isLoading } = useQuery({
		queryKey: ["identifiers", clientId],
		queryFn: () =>
			fineractApi.ClientIdentifierService.getV1ClientsByClientIdIdentifiers({
				clientId: +clientId,
			}),
	});

	return {
		identifiers,
		isLoading,
	};
};
