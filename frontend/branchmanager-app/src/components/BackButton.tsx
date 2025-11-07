import { Button } from "@fineract-apps/ui";
import { useNavigate, useRouter } from "@tanstack/react-router";

export const BackButton = ({ to }: { to?: string }) => {
	const navigate = useNavigate();
	const router = useRouter();
	const handleNavigate = () => {
		if (to) {
			navigate({ to });
		} else {
			router.history.back();
		}
	};

	return (
		<Button variant="default" onClick={handleNavigate}>
			Back
		</Button>
	);
};
