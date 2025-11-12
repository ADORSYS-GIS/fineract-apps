import { createFileRoute } from "@tanstack/react-router";
import { UserDetails } from "@/components/UserDetails";

export const Route = createFileRoute("/users/$userId/")({
	component: UserDetails,
});
