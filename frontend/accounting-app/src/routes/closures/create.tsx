import { createFileRoute } from "@tanstack/react-router";
import { CreateClosureContainer } from "./create/CreateClosureContainer";

export const Route = createFileRoute("/closures/create")({
	component: CreateClosureContainer,
});
