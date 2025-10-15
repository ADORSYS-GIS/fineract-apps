import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { Home, Landmark, PiggyBank } from "lucide-react";
import { FC } from "react";
import { useSelectAccountType } from "./useSelectAccountType";

export const SelectAccountTypeView: FC<
	ReturnType<typeof useSelectAccountType> & { clientId?: number }
> = ({ isOpen, closeModal, clientId }) => {
	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div className="fixed inset-0 z-40 bg-black/40" onClick={closeModal} />

			{/* Modal */}
			<div
				className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
				onClick={closeModal}
			>
				<div
					className="bg-white rounded-t-2xl md:rounded-lg p-6 w-full max-w-md shadow-lg"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="hidden md:block">
						<h2 className="text-xl font-bold text-center mb-6">Open Account</h2>
					</div>
					<div className="md:hidden flex justify-center mb-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>
					<div className="md:hidden">
						<h2 className="text-xl font-bold text-center mb-6">Open Account</h2>
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
									<p className="font-semibold">Current Account</p>
									<p className="text-sm text-gray-500">
										A transactional account for daily use
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
									<p className="font-semibold">Savings Account</p>
									<p className="text-sm text-gray-500">
										An account for saving money with interest
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
									<p className="font-semibold">Loan Account</p>
									<p className="text-sm text-gray-500">
										Borrow money with a repayment plan
									</p>
								</div>
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};
