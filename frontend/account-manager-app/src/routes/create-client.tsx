import { createFileRoute } from "@tanstack/react-router";
import { CreateClient } from "../pages/create-client/CreateClient";

export const Route = createFileRoute("/create-client")({
	component: CreateClient,
});
