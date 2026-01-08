import { Button } from "@fineract-apps/ui";
import { PageHeader } from "@/components/PageHeader";
import { JournalEntryDetail } from "./useJournalEntryDetail";

export interface JournalEntryDetailViewProps {
	entry: JournalEntryDetail | null;
	isLoading: boolean;
	onBack: () => void;
}

export const JournalEntryDetailView = ({
	entry,
	isLoading,
	onBack,
}: JournalEntryDetailViewProps) => {
	if (isLoading) {
		return <div className="p-4">Loading...</div>;
	}

	if (!entry) {
		return <div className="p-4">Journal entry not found.</div>;
	}

	const totalDebits = entry.debits.reduce((sum, item) => sum + item.amount, 0);
	const totalCredits = entry.credits.reduce(
		(sum, item) => sum + item.amount,
		0,
	);
	const isBalanced = totalDebits === totalCredits;

	return (
		<div className="p-4 sm:p-6">
			<PageHeader
				title="Journal Entry Details"
				subtitle={`Transaction ID: ${entry.transactionId}`}
			/>

			<div className="mt-6 bg-white rounded-lg shadow p-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
					<DetailRow label="Transaction Date" value={entry.transactionDate} />
					<DetailRow label="Office" value={entry.officeName} />
					<DetailRow
						label="Reference Number"
						value={entry.referenceNumber || "-"}
					/>
					<DetailRow label="Created By" value={entry.createdBy} />
					<DetailRow label="Created On" value={entry.createdDate} />
					<div>
						<p className="text-sm text-gray-500">Status</p>
						<span
							className={`px-2 py-1 text-xs font-semibold rounded-full ${
								isBalanced
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800"
							}`}
						>
							{isBalanced ? "Balanced" : "Unbalanced"}
						</span>
					</div>
				</div>

				<div className="mb-6">
					<p className="text-sm text-gray-500">Comments</p>
					<p className="font-semibold">{entry.comments || "-"}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-lg font-semibold mb-2">Debits</h3>
						<div className="border rounded-lg p-4">
							{entry.debits.map((debit) => (
								<div
									key={debit.glAccountId}
									className="flex justify-between items-center py-2 border-b"
								>
									<span>
										{debit.glAccountCode} - {debit.glAccountName}
									</span>
									<span className="font-semibold text-red-600">
										{debit.amount.toFixed(2)}
									</span>
								</div>
							))}
							<div className="flex justify-between font-bold mt-2">
								<span>Total Debits</span>
								<span>{totalDebits.toFixed(2)}</span>
							</div>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-2">Credits</h3>
						<div className="border rounded-lg p-4">
							{entry.credits.map((credit) => (
								<div
									key={credit.glAccountId}
									className="flex justify-between items-center py-2 border-b"
								>
									<span>
										{credit.glAccountCode} - {credit.glAccountName}
									</span>
									<span className="font-semibold text-green-600">
										{credit.amount.toFixed(2)}
									</span>
								</div>
							))}
							<div className="flex justify-between font-bold mt-2">
								<span>Total Credits</span>
								<span>{totalCredits.toFixed(2)}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 flex justify-end">
					<Button onClick={onBack}>Back to Journal Entries</Button>
				</div>
			</div>
		</div>
	);
};

const DetailRow = ({
	label,
	value,
}: {
	label: string;
	value?: string | number | Date;
}) => (
	<div>
		<p className="text-sm text-gray-600">{label}</p>
		<p className="font-medium">{String(value)}</p>
	</div>
);
