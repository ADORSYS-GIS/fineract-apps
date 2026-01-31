import { createFileRoute } from "@tanstack/react-router";
import { KycReviewDetail } from "../pages/kyc-reviews/KycReviewDetail";

export const Route = createFileRoute("/kyc-reviews/$externalId")({
	component: () => {
		const { externalId } = Route.useParams();
		return <KycReviewDetail externalId={externalId} />;
	},
});
