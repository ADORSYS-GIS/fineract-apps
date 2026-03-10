import { FC } from "react";
import { ClientDetailsView } from "./ClientDetails.view";
import { useClientDetails } from "./useClientDetails";

export const ClientDetails: FC = () => {
	const clientDetailsProps = useClientDetails();
	return <ClientDetailsView {...clientDetailsProps} />;
};
