import {
	Banknote,
	BarChart3,
	CheckCircle,
	Clock,
	Play,
	Plus,
	RefreshCw,
	X,
	XCircle,
} from "lucide-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { RebalanceProposal } from "@/services/assetApi";

interface Settlement {
	id: string;
	lpClientId: number | null;
	settlementType: string;
	amount: number;
	status: string;
	description: string | null;
	sourceGlCode: string | null;
	destinationGlCode: string | null;
	createdBy: string | null;
	approvedBy: string | null;
	createdAt: string;
	approvedAt: string | null;
	executedAt: string | null;
	rejectionReason: string | null;
}

interface LPBalance {
	lpClientId: number;
	lpClientName: string;
	lsavBalance: number;
	lspdBalance: number;
	ltaxBalance: number;
	unsettledTotal: number;
	assetCount: number;
}

interface TrustBalance {
	name: string;
	glCode: string;
	debits: number;
	credits: number;
	balance: number;
}

interface SettlementViewProps {
	settlements?: { content: Settlement[]; totalElements: number };
	summary?: { pendingCount: number; approvedCount: number; totalCount: number };
	lpBalances?: LPBalance[];
	trustBalances?: TrustBalance[];
	showProposal: boolean;
	setShowProposal: (v: boolean) => void;
	reservePercent: number;
	setReservePercent: (v: number) => void;
	rebalanceProposal?: RebalanceProposal;
	isProposalLoading: boolean;
	fetchProposal: () => void;
	executeRebalanceMutation: {
		mutate: (transfers: RebalanceProposal["transfers"]) => void;
		isPending: boolean;
	};
	isLoading: boolean;
	isError: boolean;
	refetch: () => void;
	statusFilter: string;
	setStatusFilter: (v: string) => void;
	showCreateForm: boolean;
	setShowCreateForm: (v: boolean) => void;
	approveMutation: { mutate: (id: string) => void; isPending: boolean };
	executeMutation: { mutate: (id: string) => void; isPending: boolean };
	rejectMutation: {
		mutate: (args: { id: string; reason?: string }) => void;
		isPending: boolean;
	};
	createMutation: {
		mutate: (data: {
			settlementType: string;
			amount: number;
			lpClientId?: number;
			description?: string;
			sourceGlCode?: string;
			destinationGlCode?: string;
		}) => void;
		isPending: boolean;
	};
}

const STATUS_COLORS: Record<string, string> = {
	PENDING:
		"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
	APPROVED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
	EXECUTED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const TYPE_LABELS: Record<string, string> = {
	LP_PAYOUT: "LP Payout",
	TAX_REMITTANCE: "Tax Remittance",
	TRUST_REBALANCE: "Trust Rebalance",
	FEE_COLLECTION: "Fee Collection",
};

const fmt = (n: number) =>
	new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 0 }).format(n);

export const SettlementView: FC<SettlementViewProps> = ({
	settlements,
	summary,
	lpBalances,
	trustBalances,
	showProposal,
	setShowProposal,
	reservePercent,
	setReservePercent,
	rebalanceProposal,
	isProposalLoading,
	fetchProposal,
	executeRebalanceMutation,
	isLoading,
	isError,
	refetch,
	statusFilter,
	setStatusFilter,
	showCreateForm,
	setShowCreateForm,
	approveMutation,
	executeMutation,
	rejectMutation,
	createMutation,
}) => {
	const items = settlements?.content ?? [];

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold dark:text-white">Settlement</h1>
					<p className="text-gray-500 dark:text-gray-400 text-sm">
						LP payouts, tax remittances, and trust account operations
					</p>
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => {
							setShowProposal(true);
							fetchProposal();
						}}
						className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
					>
						<BarChart3 className="w-4 h-4" />
						Propose Rebalance
					</button>
					<button
						onClick={() => setShowCreateForm(true)}
						className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
					>
						<Plus className="w-4 h-4" />
						New Settlement
					</button>
					<button
						onClick={() => refetch()}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						<RefreshCw className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
					<div className="flex items-center gap-2 text-yellow-500 text-sm">
						<Clock className="w-4 h-4" />
						Pending Approval
					</div>
					<p className="text-2xl font-bold dark:text-white mt-1">
						{summary?.pendingCount ?? 0}
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
					<div className="flex items-center gap-2 text-blue-500 text-sm">
						<CheckCircle className="w-4 h-4" />
						Approved (Ready)
					</div>
					<p className="text-2xl font-bold dark:text-white mt-1">
						{summary?.approvedCount ?? 0}
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
					<div className="flex items-center gap-2 text-gray-500 text-sm">
						<Banknote className="w-4 h-4" />
						Total Settlements
					</div>
					<p className="text-2xl font-bold dark:text-white mt-1">
						{summary?.totalCount ?? 0}
					</p>
				</div>
			</div>

			{/* LP Unsettled Balances */}
			{lpBalances && lpBalances.length > 0 && (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
					<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
						LP Unsettled Balances
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						{lpBalances.map((lp: LPBalance) => (
							<div
								key={lp.lpClientId}
								className="border dark:border-gray-700 rounded-lg p-3"
							>
								<div className="font-medium dark:text-white text-sm">
									{lp.lpClientName}
								</div>
								<div className="text-xs text-gray-400 mt-1">
									LSAV: {fmt(lp.lsavBalance)} · LSPD: {fmt(lp.lspdBalance)} ·
									LTAX: {fmt(lp.ltaxBalance)}
								</div>
								<div className="text-lg font-bold mt-1 dark:text-white">
									{fmt(lp.unsettledTotal)}{" "}
									<span className="text-xs text-gray-400">XAF</span>
								</div>
								<div className="text-xs text-gray-400">
									{lp.assetCount} assets
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Trust Account Balances */}
			{trustBalances && trustBalances.length > 0 && (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
					<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
						Trust Account Balances
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
						{trustBalances.map((t) => (
							<div
								key={t.glCode}
								className="border dark:border-gray-700 rounded-lg p-3"
							>
								<div className="font-medium dark:text-white text-sm">
									{t.name}
								</div>
								<div className="text-xs text-gray-400 mt-1">GL {t.glCode}</div>
								<div
									className={`text-lg font-bold mt-1 ${t.balance < 0 ? "text-red-500" : "text-green-600"}`}
								>
									{fmt(t.balance)} XAF
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Rebalance Proposal */}
			{showProposal && (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold dark:text-white">
							Rebalance Proposal
						</h3>
						<button
							onClick={() => setShowProposal(false)}
							className="text-gray-400 hover:text-gray-600"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<div className="flex items-center gap-4">
						<label className="text-sm text-gray-500 dark:text-gray-400">
							Reserve %
						</label>
						<input
							type="range"
							min={0}
							max={50}
							value={reservePercent}
							onChange={(e) => setReservePercent(Number(e.target.value))}
							className="w-48"
						/>
						<span className="text-sm font-mono dark:text-white">
							{reservePercent}%
						</span>
					</div>

					{isProposalLoading ? (
						<div className="text-center py-4 text-gray-500">Calculating...</div>
					) : rebalanceProposal ? (
						<>
							<div className="grid grid-cols-2 gap-6">
								<div>
									<h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
										Outflows Needed
									</h4>
									<div className="space-y-1 text-sm dark:text-gray-300">
										<div className="flex justify-between">
											<span>LP Owed</span>
											<span>{fmt(rebalanceProposal.totalLpOwed)} XAF</span>
										</div>
										<div className="flex justify-between">
											<span>Tax Owed</span>
											<span>{fmt(rebalanceProposal.totalTaxOwed)} XAF</span>
										</div>
										<div className="flex justify-between">
											<span>Fees Owed</span>
											<span>{fmt(rebalanceProposal.totalFeesOwed)} XAF</span>
										</div>
										<div className="flex justify-between font-bold border-t pt-1 dark:border-gray-600">
											<span>Total Outflow</span>
											<span>
												{fmt(rebalanceProposal.totalOutflowNeeded)} XAF
											</span>
										</div>
										<div className="flex justify-between text-blue-600 mt-2">
											<span>Need in UBA (5011)</span>
											<span>{fmt(rebalanceProposal.needInUba)} XAF</span>
										</div>
										<div className="flex justify-between text-blue-600">
											<span>Need in Afriland (5031)</span>
											<span>{fmt(rebalanceProposal.needInAfriland)} XAF</span>
										</div>
									</div>
								</div>
								<div>
									<h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
										Mobile Money Sources
									</h4>
									<div className="space-y-1 text-sm dark:text-gray-300">
										<div className="flex justify-between">
											<span>MTN MoMo (5001)</span>
											<span>{fmt(rebalanceProposal.momoBalance)} XAF</span>
										</div>
										<div className="flex justify-between text-gray-400">
											<span className="pl-4">
												Available (after {reservePercent}% reserve)
											</span>
											<span>{fmt(rebalanceProposal.momoAvailable)}</span>
										</div>
										<div className="flex justify-between">
											<span>Orange (5002)</span>
											<span>{fmt(rebalanceProposal.orangeBalance)} XAF</span>
										</div>
										<div className="flex justify-between text-gray-400">
											<span className="pl-4">
												Available (after {reservePercent}% reserve)
											</span>
											<span>{fmt(rebalanceProposal.orangeAvailable)}</span>
										</div>
										<div className="flex justify-between font-bold border-t pt-1 dark:border-gray-600">
											<span>Total Available</span>
											<span>
												{fmt(rebalanceProposal.totalMobileAvailable)} XAF
											</span>
										</div>
									</div>
								</div>
							</div>

							{rebalanceProposal.feasible ? (
								<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2 text-sm text-green-700 dark:text-green-300">
									Sufficient funds available
								</div>
							) : (
								<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 text-sm text-red-700 dark:text-red-300">
									Shortfall: {fmt(rebalanceProposal.shortfall)} XAF — increase
									reserve or add funds
								</div>
							)}

							{rebalanceProposal.transfers.length > 0 && (
								<>
									<h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
										Proposed Transfers
									</h4>
									{[
										{
											phase: 1,
											title: "Phase 1: Trust Rebalance",
											icon: "arrow-right-left",
											hint: "Move cash from mobile wallets to bank accounts (internal Azamra transfers)",
										},
										{
											phase: 2,
											title: "Phase 2: LP Payout & Fee Collection",
											icon: "banknotes",
											hint: "After trust rebalance, wire funds from UBA to LP's external bank account",
										},
										{
											phase: 3,
											title: "Phase 3: Tax Remittance",
											icon: "building-library",
											hint: "After trust rebalance, wire funds from Afriland to DGI tax authority",
										},
									].map(({ phase, title, hint }) => {
										const phaseTransfers = rebalanceProposal.transfers.filter(
											(t) => t.phase === phase,
										);
										if (phaseTransfers.length === 0) return null;
										return (
											<div key={phase} className="mb-4">
												<h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mt-3 mb-1">
													{title}
												</h5>
												<p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
													{phase === 1 ? "\u2139\uFE0F" : "\u26A0\uFE0F"} {hint}
												</p>
												<table className="w-full text-sm">
													<thead>
														<tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
															<th className="pb-2">From</th>
															<th className="pb-2">To</th>
															<th className="pb-2 text-right">Amount</th>
														</tr>
													</thead>
													<tbody>
														{phaseTransfers.map((t) => (
															<tr
																key={`${t.sourceGlCode}-${t.destinationGlCode}`}
																className="border-b dark:border-gray-700"
															>
																<td className="py-2 dark:text-gray-300">
																	{t.sourceName} ({t.sourceGlCode})
																</td>
																<td className="py-2 dark:text-gray-300">
																	{t.destinationName} ({t.destinationGlCode})
																</td>
																<td className="py-2 text-right font-mono dark:text-white">
																	{fmt(t.amount)} XAF
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										);
									})}
								</>
							)}

							<div className="flex justify-end gap-2">
								<button
									onClick={() => setShowProposal(false)}
									className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
								>
									Cancel
								</button>
								<button
									onClick={() =>
										executeRebalanceMutation.mutate(rebalanceProposal.transfers)
									}
									disabled={
										executeRebalanceMutation.isPending ||
										rebalanceProposal.transfers.length === 0
									}
									className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
								>
									{executeRebalanceMutation.isPending
										? "Creating..."
										: `Create ${rebalanceProposal.transfers.length} Settlement(s)`}
								</button>
							</div>
						</>
					) : null}
				</div>
			)}

			{/* Filter */}
			<div className="flex gap-2">
				{["ALL", "PENDING", "APPROVED", "EXECUTED", "REJECTED"].map((s) => (
					<button
						key={s}
						onClick={() => setStatusFilter(s)}
						className={`px-3 py-1.5 rounded text-sm ${
							statusFilter === s
								? "bg-blue-600 text-white"
								: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
						}`}
					>
						{s}
					</button>
				))}
			</div>

			{/* Create Form Modal */}
			{showCreateForm && (
				<CreateSettlementForm
					onSubmit={(data) => createMutation.mutate(data)}
					onCancel={() => setShowCreateForm(false)}
					isPending={createMutation.isPending}
					lpBalances={lpBalances}
				/>
			)}

			{/* Table */}
			{isLoading ? (
				<div className="text-center py-8 text-gray-500">Loading...</div>
			) : isError ? (
				<div className="text-center py-8 text-red-500">
					Failed to load settlements.
				</div>
			) : (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
								<th className="px-4 py-3">TYPE</th>
								<th className="px-4 py-3">AMOUNT</th>
								<th className="px-4 py-3">GL FLOW</th>
								<th className="px-4 py-3">ACTION REQUIRED</th>
								<th className="px-4 py-3">STATUS</th>
								<th className="px-4 py-3">CREATED</th>
								<th className="px-4 py-3">ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{items.length === 0 ? (
								<tr>
									<td
										colSpan={8}
										className="px-4 py-8 text-center text-gray-400"
									>
										No settlements found
									</td>
								</tr>
							) : (
								items.map((s) => (
									<tr key={s.id} className="border-b dark:border-gray-700">
										<td className="px-4 py-2 dark:text-gray-200">
											{TYPE_LABELS[s.settlementType] ?? s.settlementType}
										</td>
										<td className="px-4 py-2 font-mono dark:text-gray-200">
											{fmt(s.amount)} XAF
										</td>
										<td className="px-4 py-2 font-mono text-xs dark:text-gray-400">
											{s.sourceGlCode && s.destinationGlCode
												? `${s.sourceGlCode} → ${s.destinationGlCode}`
												: "-"}
										</td>
										<td className="px-4 py-2 text-xs dark:text-gray-400">
											{s.settlementType === "TRUST_REBALANCE" &&
												s.status === "PENDING" &&
												"Initiate transfer in MoMo/Orange portal"}
											{s.settlementType === "TRUST_REBALANCE" &&
												s.status === "APPROVED" &&
												"Confirm transfer received in bank"}
											{s.settlementType === "LP_PAYOUT" &&
												(s.status === "PENDING" || s.status === "APPROVED") &&
												"Wire from UBA to LP bank account"}
											{s.settlementType === "TAX_REMITTANCE" &&
												(s.status === "PENDING" || s.status === "APPROVED") &&
												"Wire from Afriland to DGI"}
											{s.settlementType === "FEE_COLLECTION" &&
												(s.status === "PENDING" || s.status === "APPROVED") &&
												"Internal fee transfer"}
											{s.status === "EXECUTED" && "\u2705 Completed"}
											{s.status === "REJECTED" && "\u274C Rejected"}
										</td>
										<td className="px-4 py-2">
											<span
												className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[s.status] ?? ""}`}
											>
												{s.status}
											</span>
										</td>
										<td className="px-4 py-2 text-xs dark:text-gray-400">
											{new Date(s.createdAt).toLocaleDateString()}
											<br />
											<span className="text-gray-400">
												by {s.createdBy ?? "system"}
											</span>
										</td>
										<td className="px-4 py-2">
											<div className="flex gap-1">
												{s.status === "PENDING" && (
													<>
														<button
															onClick={() => approveMutation.mutate(s.id)}
															className="p-1 text-blue-600 hover:bg-blue-50 rounded"
															title="Approve"
														>
															<CheckCircle className="w-4 h-4" />
														</button>
														<button
															onClick={() =>
																rejectMutation.mutate({ id: s.id })
															}
															className="p-1 text-red-600 hover:bg-red-50 rounded"
															title="Reject"
														>
															<XCircle className="w-4 h-4" />
														</button>
													</>
												)}
												{s.status === "APPROVED" && (
													<button
														onClick={() => executeMutation.mutate(s.id)}
														className="p-1 text-green-600 hover:bg-green-50 rounded"
														title="Execute"
													>
														<Play className="w-4 h-4" />
													</button>
												)}
												{s.status === "EXECUTED" && (
													<a
														href={`/api/v1/admin/settlement/${s.id}/report`}
														target="_blank"
														rel="noopener noreferrer"
														className="p-1 text-blue-600 hover:bg-blue-50 rounded inline-block"
														title="Export CSV"
													>
														<RefreshCw className="w-4 h-4" />
													</a>
												)}
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

function CreateSettlementForm({
	onSubmit,
	onCancel,
	isPending,
	lpBalances,
}: {
	onSubmit: (data: {
		settlementType: string;
		amount: number;
		lpClientId?: number;
		description?: string;
		sourceGlCode?: string;
		destinationGlCode?: string;
	}) => void;
	onCancel: () => void;
	isPending: boolean;
	lpBalances?: LPBalance[];
}) {
	const glDefaults: Record<
		string,
		{ source: string; sourceName: string; dest: string; destName: string }
	> = {
		LP_PAYOUT: {
			source: "4011",
			sourceName: "LP Settlement Control",
			dest: "5011",
			destName: "UBA Bank",
		},
		TAX_REMITTANCE: {
			source: "4013",
			sourceName: "LP Tax Withholding",
			dest: "5031",
			destName: "Afriland Tax",
		},
		FEE_COLLECTION: {
			source: "4201",
			sourceName: "Platform Fee Payable",
			dest: "5011",
			destName: "UBA Bank",
		},
		TRUST_REBALANCE: { source: "", sourceName: "", dest: "", destName: "" },
	};

	const [type, setType] = useState("LP_PAYOUT");
	const [amount, setAmount] = useState("");
	const [lpClientId, setLpClientId] = useState("");
	const [description, setDescription] = useState("");
	const [sourceGl, setSourceGl] = useState(glDefaults.LP_PAYOUT.source);
	const [destGl, setDestGl] = useState(glDefaults.LP_PAYOUT.dest);

	useEffect(() => {
		const defaults = glDefaults[type];
		if (defaults) {
			setSourceGl(defaults.source);
			setDestGl(defaults.dest);
		}
	}, [type]);

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold dark:text-white">
					New Settlement
				</h3>
				<button
					onClick={onCancel}
					className="text-gray-400 hover:text-gray-600"
				>
					<X className="w-5 h-5" />
				</button>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
						Type
					</label>
					<select
						value={type}
						onChange={(e) => setType(e.target.value)}
						className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="LP_PAYOUT">LP Payout</option>
						<option value="TAX_REMITTANCE">Tax Remittance</option>
						<option value="TRUST_REBALANCE">Trust Rebalance</option>
						<option value="FEE_COLLECTION">Fee Collection</option>
					</select>
				</div>
				<div>
					<label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
						Amount (XAF)
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="0"
					/>
				</div>
				<div>
					<label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
						LP Client
					</label>
					<select
						value={lpClientId}
						onChange={(e) => setLpClientId(e.target.value)}
						className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					>
						<option value="">— All / None —</option>
						{lpBalances?.map((lp) => (
							<option key={lp.lpClientId} value={String(lp.lpClientId)}>
								{lp.lpClientName} ({fmt(lp.unsettledTotal)} XAF)
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
						Description
					</label>
					<input
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
					/>
				</div>
				<div>
					<label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
						Source GL Code
					</label>
					<input
						type="text"
						value={sourceGl}
						onChange={(e) => setSourceGl(e.target.value)}
						className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="e.g. 4011"
					/>
					{glDefaults[type]?.sourceName && (
						<span className="text-xs text-gray-400 mt-1 block">
							{glDefaults[type].sourceName}
						</span>
					)}
				</div>
				<div>
					<label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
						Destination GL Code
					</label>
					<input
						type="text"
						value={destGl}
						onChange={(e) => setDestGl(e.target.value)}
						className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="e.g. 5011"
					/>
					{glDefaults[type]?.destName && (
						<span className="text-xs text-gray-400 mt-1 block">
							{glDefaults[type].destName}
						</span>
					)}
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<button
					onClick={onCancel}
					className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
				>
					Cancel
				</button>
				<button
					onClick={() =>
						onSubmit({
							settlementType: type,
							amount: Number(amount),
							lpClientId: lpClientId ? Number(lpClientId) : undefined,
							description: description || undefined,
							sourceGlCode: sourceGl || undefined,
							destinationGlCode: destGl || undefined,
						})
					}
					disabled={isPending || !amount}
					className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
				>
					{isPending ? "Creating..." : "Create Settlement"}
				</button>
			</div>
		</div>
	);
}
