import { createFileRoute } from "@tanstack/react-router";
import { CreateEntryContainer } from "./CreateEntryContainer";

export const Route = createFileRoute("/create-entry/")({
	component: CreateEntryContainer,
});
