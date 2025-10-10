import { Button } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";

export const BackButton = ({ to }: { to?: string }) => {
	const navigate = useNavigate();
	const handleNavigate = () => {
		if (to) {
			navigate({ to });
		} else {
			window.history.back();
		}
	};

	return (
		<Button variant="default" onClick={handleNavigate}>
			Back
		</Button>
	);
};
