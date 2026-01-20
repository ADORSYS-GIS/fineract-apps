import { createFileRoute } from "@tanstack/react-router";
import { EditGLAccountContainer } from "./edit/EditGLAccountContainer";

export const Route = createFileRoute("/gl-accounts/$accountId/edit")({
	component: EditGLAccountContainer,
});
