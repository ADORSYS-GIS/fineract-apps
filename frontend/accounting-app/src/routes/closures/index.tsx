import { createFileRoute } from "@tanstack/react-router";
import { ClosuresContainer } from "./ClosuresContainer";

export const Route = createFileRoute("/closures/")({
	component: ClosuresContainer,
});
