import { Button, Form, Input } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useOpenAccount } from "./useOpenAccount";

export const OpenAccountView: FC<
	ReturnType<typeof useOpenAccount> & { clientId: number }
> = ({ onSubmit, initialValues, products, clientId }) => {
	const { t } = useTranslation();
	return (
		<div className="bg-gray-50 min-h-screen">
			<header className="p-4 flex items-center border-b bg-white md:ml-64">
				<Link
					to="/select-account-type/$clientId"
					params={{ clientId: String(clientId) }}
				>
					<Button variant="ghost">
						<ArrowLeft className="h-6 w-6" />
					</Button>
				</Link>
				<h1 className="text-lg font-semibold ml-4">{t("openAccount")}</h1>
			</header>

			<main className="p-6 md:ml-64">
				<Form initialValues={initialValues} onSubmit={onSubmit}>
					<div className="space-y-4">
						<Input name="accountType" label={t("accountType")} disabled />
						<Input
							name="productName"
							label={t("productName")}
							type="select"
							placeholder={t("chooseAProductName")}
							options={
								products
									?.filter((product) => product.name && product.id)
									.map((product) => ({
										label: product.name as string,
										value: product.id as number,
									})) || []
							}
						/>
					</div>
					<Button type="submit" className="w-full mt-8">
						{t("createAccount")}
					</Button>
				</Form>
			</main>
		</div>
	);
};
