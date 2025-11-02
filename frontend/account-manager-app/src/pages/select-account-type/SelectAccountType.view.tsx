import { Button, Card } from "@fineract-apps/ui";
import { Link, useParams } from "@tanstack/react-router";
import {
	AreaChart,
	ArrowLeft,
	Landmark,
	Lock,
	PiggyBank,
	Repeat,
} from "lucide-react";
import { FC, ReactNode } from "react";

const accountTypes: {
	label: string;
	type: string;
	icon: ReactNode;
	description: string;
}[] = [
	{
		label: "Savings Account",
		type: "savings",
		icon: <PiggyBank className="h-8 w-8 text-green-500" />,
		description: "Open a new savings account.",
	},
	{
		label: "Share Account",
		type: "shares",
		icon: <AreaChart className="h-8 w-8 text-purple-500" />,
		description: "Purchase new shares.",
	},
	{
		label: "Recurring Deposit Account",
		type: "recurring",
		icon: <Repeat className="h-8 w-8 text-yellow-500" />,
		description: "Start a recurring deposit.",
	},
	{
		label: "Fixed Deposits Account",
		type: "fixed",
		icon: <Lock className="h-8 w-8 text-red-500" />,
		description: "Open a fixed deposit account.",
	},
	{
		label: "Loan Account",
		type: "loan",
		icon: <Landmark className="h-8 w-8 text-blue-500" />,
		description: "Apply for a new loan product.",
	},
];

export const SelectAccountTypeView: FC = () => {
	const { clientId } = useParams({ from: "/select-account-type/$clientId" });

	return (
		<div className="bg-gray-50 min-h-screen">
			<header className="p-4 flex items-center border-b bg-white">
				<Link
					to="/client-details/$clientId"
					params={{ clientId: String(clientId) }}
				>
					<Button variant="ghost">
						<ArrowLeft className="h-6 w-6" />
					</Button>
				</Link>
				<h1 className="text-lg font-semibold ml-4">Select Account Type</h1>
			</header>

			<main className="p-6 ">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{accountTypes.map((account) => (
						<Link
							key={account.type}
							to="/open-account/$clientId"
							params={{ clientId: String(clientId) }}
							search={{ accountType: account.type }}
							className="block"
						>
							<Card className="p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
								<div className="flex-shrink-0">{account.icon}</div>
								<div>
									<h2 className="text-lg font-semibold">{account.label}</h2>
									<p className="text-sm text-gray-500">{account.description}</p>
								</div>
							</Card>
						</Link>
					))}
				</div>
			</main>
		</div>
	);
};
