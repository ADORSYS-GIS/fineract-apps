import { Button } from "@fineract-apps/ui";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const BackButton = ({ to }: { to?: string }) => {
	const { t } = useTranslation();
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
			{t("branchManagerCommon.back")}
		</Button>
	);
};
