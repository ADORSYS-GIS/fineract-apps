import { FC } from "react";
import { ActivateClientProps } from "./ActivateClient.types.ts";
import { ActivateClientView } from "./ActivateClient.view.tsx";
import { useActivateClient } from "./useActivateClient.ts";

export const ActivateClient: FC<ActivateClientProps> = (props) => {
	const activateClientProps = useActivateClient(props);

	return <ActivateClientView {...props} {...activateClientProps} />;
};
