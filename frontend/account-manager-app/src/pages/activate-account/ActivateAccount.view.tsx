import { Button, Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useActivateAccount } from "./useActivateAccount";

export const ActivateAccountView: FC<
	ReturnType<typeof useActivateAccount>
> = () => {
	const [isActivated, setIsActivated] = useState(false);
	const { t } = useTranslation();
	const handleActivate = () => {
		setIsActivated(true);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-md p-6 relative">
				<Link to="/dashboard" className="absolute top-4 right-4">
					<Button variant="ghost" size="sm">
						<X className="h-6 w-6" />
					</Button>
				</Link>
				<div className="text-center mb-6">
					<h2 className="text-2xl font-bold">{t("activateAccount")}</h2>
				</div>
				<div className="space-y-4">
					<p>{t("areYouSureYouWantToActivateThisAccount")}</p>
					<Button onClick={handleActivate} className="w-full">
						{t("activateNow")}
					</Button>
				</div>
			</Card>

			{isActivated && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-end justify-center p-4">
					<Card className="w-full max-w-md p-6 text-center">
						<div className="mb-4">
							<h3 className="text-xl font-bold">{t("accountActivated")}</h3>
							<p className="text-gray-600 mt-2">{t("theAccountIsNowActive")}</p>
						</div>
						<Link to="/dashboard">
							<Button className="w-full">{t("done")}</Button>
						</Link>
					</Card>
				</div>
			)}
		</div>
	);
};
