import { createFileRoute } from "@tanstack/react-router";
import { CreateUser } from "@/components/CreateUser";

function CreateUserPage() {
	return (
		<div className="p-4 max-w-5xl mx-auto">
			<CreateUser />
		</div>
	);
}

import { z } from "zod";

export const Route = createFileRoute("/users/create")({
	component: CreateUserPage,
	validateSearch: z.object({
		staffId: z.number().optional(),
	}),
});
