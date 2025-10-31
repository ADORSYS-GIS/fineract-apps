import { Button, Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FC } from "react";
import { useCreateAccount } from "./useCreateAccount";

export const CreateAccountView: FC<
	ReturnType<typeof useCreateAccount>
> = () => {
	return (
		<div className="bg-gray-50 min-h-screen flex flex-col">
			<header className="p-4 flex items-center border-b bg-white">
				<Link to="/dashboard">
					<Button variant="ghost">
						<ArrowLeft className="h-6 w-6" />
					</Button>
				</Link>
				<h1 className="text-lg font-semibold ml-4">Create Account</h1>
			</header>

			<main className="flex-1 flex items-center justify-center p-4">
				<Card className="w-full max-w-md p-8 space-y-6">
					<div className="text-center">
						<h2 className="text-2xl font-bold">Confirm Account Details</h2>
					</div>
					<form className="space-y-4">
						<div>
							<label
								htmlFor="accountType"
								className="block text-sm font-medium text-gray-700"
							>
								Account Type
							</label>
							<input
								type="text"
								id="accountType"
								value="Current Account"
								readOnly
								className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label
								htmlFor="initialDeposit"
								className="block text-sm font-medium text-gray-700"
							>
								Initial Deposit
							</label>
							<input
								type="text"
								id="initialDeposit"
								defaultValue="$ 0.00"
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<Link to="/activate-account" className="block w-full">
							<Button type="button" className="w-full">
								Confirm & Create Account
							</Button>
						</Link>
					</form>
				</Card>
			</main>
		</div>
	);
};
