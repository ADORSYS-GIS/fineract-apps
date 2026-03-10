import { Link } from "@tanstack/react-router";
import { ArrowLeft, HandCoins } from "lucide-react";
import { FC, useState } from "react";
import { getLoanStatusProps } from "@/utils/loan";
import {
	AccountActions,
	LoanDetails,
	LoanSummary,
	PerformanceHistory,
} from "./components";
import { useLoanDetails } from "./useLoanDetails";

export const LoanDetailsView: FC<ReturnType<typeof useLoanDetails>> = ({
	loan,
	isLoading,
}) => {
	const [activeTab, setActiveTab] = useState("Performance History");
	const statusProps = getLoanStatusProps(loan?.status);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div>Loading...</div>
			</div>
		);
	}

	if (!loan) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div>Loan not found</div>
			</div>
		);
	}

	const navItems = ["Performance History", "Loan Summary", "Loan Details"];

	return (
		<div className="bg-gray-100 min-h-screen font-sans">
			<header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-md">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						{loan?.clientId && (
							<Link
								to="/client-details/$clientId"
								params={{ clientId: String(loan.clientId) }}
								className="text-white hover:bg-white/20 p-2 rounded-full"
							>
								<ArrowLeft className="h-6 w-6" />
							</Link>
						)}
						<div className="bg-white/20 p-3 rounded-full">
							<HandCoins className="h-8 w-8" />
						</div>
						<div>
							<p className="text-sm opacity-80">{loan?.loanProductName}</p>
							<div className="flex items-center gap-2">
								<p className="text-xl font-bold">{loan?.clientName}</p>
								{statusProps && (
									<span
										className={`px-2 py-1 text-xs font-semibold rounded-full text-white capitalize ${statusProps.className}`}
									>
										{statusProps.text}
									</span>
								)}
							</div>
						</div>
					</div>
					<div className="hidden md:flex items-center gap-4">
						<div className="text-right bg-white/10 p-6 rounded-lg">
							<p className="text-2xl font-bold">Account Overview</p>
							<div className="flex gap-8 mt-4">
								<div>
									<p className="text-md opacity-80">Principal</p>
									<p className="font-bold text-2xl">{loan?.principal}</p>
								</div>
								<div>
									<p className="text-md opacity-80">Interest</p>
									<p className="font-bold text-2xl">
										{loan?.summary?.interestCharged}
									</p>
								</div>
							</div>
						</div>
						<AccountActions loan={loan} />
					</div>
					<div className="md:hidden">
						<AccountActions loan={loan} />
					</div>
				</div>
				<div className="md:hidden text-center bg-white/10 p-4 rounded-lg w-full mt-4">
					<p className="text-xl font-bold">Account Overview</p>
					<div className="flex justify-center gap-6 mt-2">
						<div>
							<p className="text-sm opacity-80">Principal</p>
							<p className="font-bold text-lg">{loan?.principal}</p>
						</div>
						<div>
							<p className="text-sm opacity-80">Interest</p>
							<p className="font-bold text-lg">
								{loan?.summary?.interestCharged}
							</p>
						</div>
					</div>
				</div>
			</header>

			<main className="p-4 md:p-6 ">
				<div className="bg-white rounded-lg shadow">
					<nav className="flex border-b">
						{navItems.map((item) => (
							<button
								key={item}
								onClick={() => setActiveTab(item)}
								className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
									activeTab === item
										? "border-b-2 border-blue-600 text-blue-600"
										: "text-gray-500 hover:text-blue-500"
								}`}
							>
								{item}
							</button>
						))}
					</nav>

					<div className="p-4">
						{activeTab === "Performance History" && (
							<PerformanceHistory loan={loan} />
						)}
						{activeTab === "Loan Summary" && <LoanSummary loan={loan} />}
						{activeTab === "Loan Details" && <LoanDetails loan={loan} />}
					</div>
				</div>
			</main>
		</div>
	);
};
