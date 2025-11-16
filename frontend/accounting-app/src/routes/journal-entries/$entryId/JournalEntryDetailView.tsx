import { Button, Card } from "@fineract-apps/ui";
import { ArrowLeft, Calendar, Building, FileText, User } from "lucide-react";
import type { JournalEntryDetail } from "./useJournalEntryDetail";

interface JournalEntryDetailViewProps {
	entry: JournalEntryDetail | null;
	isLoading: boolean;
	onBack: () => void;
}

export function JournalEntryDetailView({
	entry,
	isLoading,
	onBack,
}: JournalEntryDetailViewProps) {
	if (isLoading) {
		return (
			<div className="p-6">
				<Card className="p-6">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-gray-200 rounded w-1/3" />
						<div className="h-4 bg-gray-200 rounded w-1/2" />
						<div className="h-4 bg-gray-200 rounded w-2/3" />
						{[...Array(4)].map((_, i) => (
							<div key={i} className="h-12 bg-gray-200 rounded" />
						))}
					</div>
				</Card>
			</div>
		);
	}

	if (!entry) {
		return (
			<div className="p-6">
				<button
					onClick={onBack}
					type="button"
					className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Journal Entries
				</button>
				<Card className="p-12 text-center">
					<FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
					<h3 className="text-lg font-semibold mb-2">Entry Not Found</h3>
					<p className="text-gray-500">
						The journal entry you're looking for doesn't exist.
					</p>
				</Card>
			</div>
		);
	}

	const totalDebits = entry.debits.reduce(
		(sum, debit) => sum + debit.amount,
		0,
	);
	const totalCredits = entry.credits.reduce(
		(sum, credit) => sum + credit.amount,
		0,
	);
	const isBalanced = totalDebits === totalCredits;

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<button
				onClick={onBack}
				type="button"
				className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to Journal Entries
			</button>

			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Journal Entry Details</h1>
				<div className="flex items-center gap-2">
					{isBalanced ? (
						<span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
							Balanced
						</span>
					) : (
						<span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
							Unbalanced
						</span>
					)}
				</div>
			</div>

			<Card className="p-6 mb-6">
				<h2 className="text-lg font-semibold mb-4">Transaction Information</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="flex items-start gap-3">
						<FileText className="h-5 w-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-sm text-gray-500">Transaction ID</p>
							<p className="font-medium">{entry.transactionId}</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-sm text-gray-500">Transaction Date</p>
							<p className="font-medium">
								{new Date(entry.transactionDate).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<Building className="h-5 w-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-sm text-gray-500">Office</p>
							<p className="font-medium">{entry.officeName}</p>
						</div>
					</div>

					{entry.referenceNumber && (
						<div className="flex items-start gap-3">
							<FileText className="h-5 w-5 text-gray-400 mt-0.5" />
							<div>
								<p className="text-sm text-gray-500">Reference Number</p>
								<p className="font-medium">{entry.referenceNumber}</p>
							</div>
						</div>
					)}

					<div className="flex items-start gap-3">
						<User className="h-5 w-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-sm text-gray-500">Created By</p>
							<p className="font-medium">{entry.createdBy}</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-sm text-gray-500">Created Date</p>
							<p className="font-medium">
								{new Date(entry.createdDate).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					</div>
				</div>

				{entry.comments && (
					<div className="mt-6 pt-6 border-t">
						<p className="text-sm text-gray-500 mb-2">Comments</p>
						<p className="text-gray-700">{entry.comments}</p>
					</div>
				)}
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<Card className="p-6">
					<h2 className="text-lg font-semibold mb-4 text-red-600">
						Debit Entries
					</h2>
					<div className="space-y-3">
						{entry.debits.length === 0 ? (
							<p className="text-gray-500 text-sm">No debit entries</p>
						) : (
							entry.debits.map((debit, index) => (
								<div
									key={index}
									className="flex justify-between items-start p-3 bg-red-50 rounded-lg"
								>
									<div>
										<p className="font-medium">{debit.glAccountName}</p>
										<p className="text-sm text-gray-500">
											{debit.glAccountCode}
										</p>
									</div>
									<p className="font-semibold text-red-600">
										${debit.amount.toLocaleString()}
									</p>
								</div>
							))
						)}
						<div className="pt-3 border-t border-red-200">
							<div className="flex justify-between items-center">
								<p className="font-semibold">Total Debits</p>
								<p className="font-bold text-red-600 text-lg">
									${totalDebits.toLocaleString()}
								</p>
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<h2 className="text-lg font-semibold mb-4 text-green-600">
						Credit Entries
					</h2>
					<div className="space-y-3">
						{entry.credits.length === 0 ? (
							<p className="text-gray-500 text-sm">No credit entries</p>
						) : (
							entry.credits.map((credit, index) => (
								<div
									key={index}
									className="flex justify-between items-start p-3 bg-green-50 rounded-lg"
								>
									<div>
										<p className="font-medium">{credit.glAccountName}</p>
										<p className="text-sm text-gray-500">
											{credit.glAccountCode}
										</p>
									</div>
									<p className="font-semibold text-green-600">
										${credit.amount.toLocaleString()}
									</p>
								</div>
							))
						)}
						<div className="pt-3 border-t border-green-200">
							<div className="flex justify-between items-center">
								<p className="font-semibold">Total Credits</p>
								<p className="font-bold text-green-600 text-lg">
									${totalCredits.toLocaleString()}
								</p>
							</div>
						</div>
					</div>
				</Card>
			</div>

			{!isBalanced && (
				<Card className="p-4 bg-red-50 border-red-200">
					<div className="flex items-center gap-2 text-red-800">
						<FileText className="h-5 w-5" />
						<p className="font-medium">
							Warning: This entry is not balanced. Total debits (
							${totalDebits.toLocaleString()}) do not equal total credits ($
							{totalCredits.toLocaleString()}).
						</p>
					</div>
				</Card>
			)}
		</div>
	);
}
