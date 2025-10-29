import { useParams } from "@tanstack/react-router";
import { FC } from "react";
import { OpenSavingsAccountView } from "./OpenSavingsAccount.view";
import { useOpenSavingsAccount } from "./useOpenSavingsAccount";

export const OpenSavingsAccount: FC = () => {
	const { clientId } = useParams({ from: "/open-savings-account/$clientId" });
	const { initialValues, onSubmit } = useOpenSavingsAccount(Number(clientId));
	return <OpenSavingsAccountView initialValues={initialValues} onSubmit={onSubmit} />;
};
