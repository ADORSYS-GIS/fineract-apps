import { createFileRoute } from "@tanstack/react-router";
import { KycReviews } from "../pages/kyc-reviews/KycReviews";

export const Route = createFileRoute("/kyc-reviews")({
	component: KycReviews,
});
