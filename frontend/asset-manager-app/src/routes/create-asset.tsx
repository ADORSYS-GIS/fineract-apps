import { createFileRoute } from "@tanstack/react-router";
import { CreateAsset } from "../pages/create-asset/CreateAsset";

export const Route = createFileRoute("/create-asset")({
	component: CreateAsset,
});
