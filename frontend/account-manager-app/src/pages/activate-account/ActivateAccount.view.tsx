import { Button, Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { FC, useState } from "react";
import { useActivateAccount } from "./useActivateAccount";

export const ActivateAccountView: FC<
	ReturnType<typeof useActivateAccount>
> = () => {
	const [isActivated, setIsActivated] = useState(false);

	const handleActivate = () => {
		// In a real app, this would trigger an API call
		setIsActivated(true);
	};

	const account = {
		number: "1234567890",
		clientName: "Acme Corp",
		balance: "$0.00",
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
					<h2 className="text-2xl font-bold">Activate Account</h2>
				</div>
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Account Summary</h3>
					<div className="p-4 border rounded-md space-y-2">
						<div className="flex justify-between">
							<span className="text-gray-600">Account Number</span>
							<span className="font-medium">{account.number}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Client Name</span>
							<span className="font-medium">{account.clientName}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Balance</span>
							<span className="font-medium">{account.balance}</span>
						</div>
					</div>
					<Button onClick={handleActivate} className="w-full">
						Activate Now
					</Button>
				</div>
			</Card>

			{isActivated && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-end justify-center p-4">
					<Card className="w-full max-w-md p-6 text-center">
						<div className="mb-4">
							<h3 className="text-xl font-bold">Account Activated</h3>
							<p className="text-gray-600 mt-2">
								Account {account.number} for {account.clientName} is now active.
							</p>
						</div>
						<Link to="/dashboard">
							<Button className="w-full">Done</Button>
						</Link>
					</Card>
				</div>
			)}
		</div>
	);
};
