import { createFileRoute } from "@tanstack/react-router";
import { CreateGLAccountContainer } from "./create/CreateGLAccountContainer";

export const Route = createFileRoute("/gl-accounts/create")({
	component: CreateGLAccountContainer,
});
