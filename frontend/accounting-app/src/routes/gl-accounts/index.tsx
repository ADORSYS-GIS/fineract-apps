import { createFileRoute } from "@tanstack/react-router";
import { GLAccountsContainer } from "./GLAccountsContainer";

export const Route = createFileRoute("/gl-accounts/")({
	component: GLAccountsContainer,
});
