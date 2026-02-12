import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "../pages/registration/index.tsx";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});
