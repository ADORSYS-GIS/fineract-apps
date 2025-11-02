import { createFileRoute } from "@tanstack/react-router";
import { ClientDetails } from "../../pages/client-details/ClientDetails";

export const Route = createFileRoute("/client-details/$clientId")({
	component: ClientDetails,
});
