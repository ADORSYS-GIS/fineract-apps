import { createFileRoute } from "@tanstack/react-router";
import { CreateUser } from "@/components/CreateUser";

export const Route = createFileRoute("/users/create")({
	component: CreateUser,
});
