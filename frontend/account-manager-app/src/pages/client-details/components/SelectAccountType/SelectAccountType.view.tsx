import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { Home, Landmark, PiggyBank, X } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelectAccountType } from "./useSelectAccountType";

export const SelectAccountTypeView: FC<
	ReturnType<typeof useSelectAccountType> & { clientId?: number }
> = ({ isOpen, closeModal, clientId }) => {
	const { t } = useTranslation();
	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				className="fixed inset-0 z-40 bg-black/40"
				onClick={closeModal}
				onKeyDown={(e) => e.key === "Escape" && closeModal()}
				aria-label={t("accountManagerCommon.closeModal")}
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
				<dialog
					className="relative bg-white rounded-t-2xl md:rounded-lg p-6 w-full max-w-md shadow-lg"
					open={isOpen}
					onClose={closeModal}
				>
					<button
						type="button"
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hidden md:block"
						onClick={closeModal}
					>
						<X className="w-6 h-6" />
					</button>
					<div className="hidden md:block">
						<h2 className="text-xl font-bold text-center mb-6">
							{t("accountManagerClientDetails.openAccount")}
						</h2>
					</div>
					<div className="md:hidden flex justify-center mb-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>
					<div className="md:hidden">
						<h2 className="text-xl font-bold text-center mb-6">
							{t("accountManagerClientDetails.openAccount")}
						</h2>
					</div>

					<div className="space-y-4">
						<Link
							to="/open-account/$clientId"
							params={{ clientId: String(clientId) }}
							search={{ accountType: "current" }}
							className="w-full"
						>
							<Button
								variant="outline"
								className="w-full justify-start p-4 h-auto"
							>
								<Home className="h-6 w-6 mr-4" />
								<div>
									<p className="font-semibold">
										{t("selectAccountType.currentAccount.title")}
									</p>
									<p className="text-sm text-gray-500">
										{t("selectAccountType.currentAccount.description")}
									</p>
								</div>
							</Button>
						</Link>

						<Link
							to="/open-account/$clientId"
							params={{ clientId: String(clientId) }}
							search={{ accountType: "savings" }}
							className="w-full"
						>
							<Button
								variant="outline"
								className="w-full justify-start p-4 h-auto"
							>
								<PiggyBank className="h-6 w-6 mr-4" />
								<div>
									<p className="font-semibold">
										{t("selectAccountType.savingsAccount.title")}
									</p>
									<p className="text-sm text-gray-500">
										{t("selectAccountType.savingsAccount.description")}
									</p>
								</div>
							</Button>
						</Link>

						<Link
							to="/open-account/$clientId"
							params={{ clientId: String(clientId) }}
							search={{ accountType: "loan" }}
							className="w-full"
						>
							<Button
								variant="outline"
								className="w-full justify-start p-4 h-auto"
							>
								<Landmark className="h-6 w-6 mr-4" />
								<div>
									<p className="font-semibold">
										{t("selectAccountType.loanAccount.title")}
									</p>
									<p className="text-sm text-gray-500">
										{t("selectAccountType.loanAccount.description")}
									</p>
								</div>
							</Button>
						</Link>
					</div>
				</dialog>
			</div>
		</>
	);
};
