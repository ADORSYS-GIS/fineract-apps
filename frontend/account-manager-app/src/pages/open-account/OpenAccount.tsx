import { useParams } from "@tanstack/react-router";
import { FC } from "react";
import { OpenAccountView } from "./OpenAccount.view";
import { useOpenAccount } from "./useOpenAccount";

export const OpenAccount: FC = () => {
	const { clientId } = useParams({ from: "/open-account/$clientId" });
	const openAccountProps = useOpenAccount(Number(clientId));
	return <OpenAccountView {...openAccountProps} clientId={Number(clientId)} />;
};
