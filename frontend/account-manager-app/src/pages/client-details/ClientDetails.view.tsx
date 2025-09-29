import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FC, useState } from "react";
import { AccountCard } from "./components/AccountCard/AccountCard";
import { SelectAccountType } from "./components/SelectAccountType/SelectAccountType";
import { useClientDetails } from "./useClientDetails";

const parseFineractDate = (dateArray: unknown): Date | null => {
	if (
		Array.isArray(dateArray) &&
		dateArray.length >= 3 &&
		typeof dateArray[0] === "number" &&
		typeof dateArray[1] === "number" &&
		typeof dateArray[2] === "number"
	) {
		// Month is 0-indexed in JavaScript Date
		return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
	}
	return null;
};

export const ClientDetailsView: FC<ReturnType<typeof useClientDetails>> = ({
	client,
	isLoading,
	accounts,
	activateAccount,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			<header className="p-4 flex items-center border-b bg-white">
				<Link to="/dashboard">
					<Button variant="ghost">
						<ArrowLeft className="h-6 w-6" />
					</Button>
				</Link>
				<h1 className="text-lg font-semibold ml-4">Client Profile</h1>
			</header>

			<main className="p-6">
				<div className="flex flex-col items-center text-center">
					<div className="w-24 h-24 rounded-full mb-4 bg-gray-200 flex items-center justify-center">
						<span className="text-gray-500 text-xs">
							{client?.displayName?.[0]}
						</span>
					</div>
					<h2 className="text-2xl font-bold">{client?.displayName}</h2>
					<p className="text-sm text-gray-500">
						Account No: {client?.accountNo}
					</p>
					<p className="text-sm text-gray-500">
						Joined{" "}
						{parseFineractDate(
							client?.timeline?.submittedOnDate,
						)?.toLocaleDateString() ?? ""}
					</p>
				</div>

				<div className="mt-8">
					<h3 className="text-lg font-semibold mb-4">Basic Information</h3>
					<div className="bg-white rounded-lg shadow p-4 space-y-4">
						<div className="flex justify-between">
							<p className="text-sm text-gray-500">Activation Date</p>
							<p className="text-md">
								{parseFineractDate(
									client?.activationDate,
								)?.toLocaleDateString() ?? ""}
							</p>
						</div>
						<div className="flex justify-between">
							<p className="text-sm text-gray-500">Office Name</p>
							<p className="text-md">{client?.officeName}</p>
						</div>
						<div className="flex justify-between">
							<p className="text-sm text-gray-500">Status</p>
							<p className="text-md">
								{(client?.status as { value: string })?.value}
							</p>
						</div>
					</div>
				</div>

				<div className="mt-8">
					<h3 className="text-lg font-semibold mb-4">Contact Details</h3>
					<div className="bg-white rounded-lg shadow p-4 space-y-4">
						<div className="flex justify-between">
							<p className="text-sm text-gray-500">Phone</p>
							<p className="text-md">
								{(client as { mobileNo?: string })?.mobileNo}
							</p>
						</div>
						<div className="flex justify-between">
							<p className="text-sm text-gray-500">Email</p>
							<p className="text-md">{client?.emailAddress}</p>
						</div>
					</div>
				</div>
				<div className="mt-8">
					<h3 className="text-lg font-semibold mb-4">Accounts</h3>
					{accounts?.savingsAccounts?.map((account) => (
						<AccountCard
							key={account.id}
							account={account}
							onActivate={activateAccount}
						/>
					))}
				</div>

				<div className="mt-8">
					<Button className="w-full" onClick={() => setIsModalOpen(true)}>
						Open Account
					</Button>
				</div>
			</main>
			<SelectAccountType
				isOpen={isModalOpen}
				closeModal={() => setIsModalOpen(false)}
				clientId={client?.id}
			/>
		</div>
	);
};
