import { createFileRoute } from "@tanstack/react-router";
import { AssetDetails } from "../pages/asset-details/AssetDetails";

export const Route = createFileRoute("/asset-details/$assetId")({
	component: AssetDetails,
});
