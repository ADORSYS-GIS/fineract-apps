import { Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const ApproveAccountView = () => {
	const { t } = useTranslation();

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			<h1 className="text-2xl font-bold mb-6">{t("approveAccount")}</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Link to="/approve/savings/account" search={{ q: "" }}>
					<Card className="p-6 flex flex-col items-center justify-center text-center h-full">
						<h2 className="text-lg font-semibold mb-2">
							{t("pendingAccounts")}
						</h2>
						<p className="text-gray-600">{t("reviewAndApproveSavings")}</p>
					</Card>
				</Link>
				<Link to="/approve/loans" search={{ q: "" }}>
					<Card className="p-6 flex flex-col items-center justify-center text-center h-full">
						<h2 className="text-lg font-semibold mb-2">{t("pendingLoans")}</h2>
						<p className="text-gray-600">{t("reviewAndApproveLoans")}</p>
					</Card>
				</Link>
			</div>
		</div>
	);
};
