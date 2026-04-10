import { Card } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Loader2 } from "lucide-react";
import { FC, useState } from "react";
import { assetApi, type IncomeHistoryEntry } from "@/services/assetApi";
import { extractErrorMessage } from "@/services/assetApi";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type FilterTab = "ALL" | "PAID" | "SCHEDULED";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
	{ key: "ALL", label: "Tout" },
	{ key: "PAID", label: "Perçu" },
	{ key: "SCHEDULED", label: "Planifié" },
];

const TYPE_BADGE: Record<string, string> = {
	COUPON: "bg-blue-100 text-blue-800",
	MATURITY: "bg-purple-100 text-purple-800",
	INCOME: "bg-green-100 text-green-800",
};

const TYPE_LABEL: Record<string, string> = {
	COUPON: "COUPON",
	MATURITY: "MATURITY",
	INCOME: "INCOME",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = (n: number) =>
	new Intl.NumberFormat("fr-FR").format(Math.round(n));

const fmtDate = (iso: string) =>
	new Date(iso).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const SummaryBar: FC<{
	totalPaid: number;
	totalScheduled: number;
	totalIrcmWithheld: number;
}> = ({ totalPaid, totalScheduled, totalIrcmWithheld }) => (
	<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
		<Card className="p-4">
			<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
				Total Perçu
			</p>
			<p className="text-2xl font-bold text-green-700">
				{fmt(totalPaid)} XAF
			</p>
		</Card>
		<Card className="p-4">
			<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
				A Recevoir
			</p>
			<p className="text-2xl font-bold text-blue-700">
				{fmt(totalScheduled)} XAF
			</p>
		</Card>
		<Card className="p-4">
			<p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
				IRCM Retenu
			</p>
			<p className="text-2xl font-bold text-gray-700">
				{fmt(totalIrcmWithheld)} XAF
			</p>
		</Card>
	</div>
);

const StatusBadge: FC<{ status: IncomeHistoryEntry["status"] }> = ({
	status,
}) => {
	if (status === "PAID") {
		return (
			<span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
				<span aria-hidden="true">&#10003;</span> PERCU
			</span>
		);
	}
	return (
		<span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
			<span aria-hidden="true">&#8987;</span> PLANIFIE
		</span>
	);
};

const TypeBadge: FC<{ type: string }> = ({ type }) => (
	<span
		className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_BADGE[type] ?? "bg-gray-100 text-gray-800"}`}
	>
		{TYPE_LABEL[type] ?? type}
	</span>
);

const IncomeTable: FC<{ entries: IncomeHistoryEntry[] }> = ({ entries }) => (
	<div className="overflow-x-auto">
		<table className="min-w-full divide-y divide-gray-200 text-sm">
			<thead className="bg-gray-50">
				<tr>
					<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Date
					</th>
					<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Actif
					</th>
					<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Type
					</th>
					<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Unites
					</th>
					<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Brut
					</th>
					<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						IRCM
					</th>
					<th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Net
					</th>
					<th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Statut
					</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-gray-100 bg-white">
				{entries.map((entry) => (
					<tr key={entry.id} className="hover:bg-gray-50 transition-colors">
						<td className="px-3 py-2 whitespace-nowrap text-gray-600">
							{fmtDate(entry.paymentDate)}
						</td>
						<td className="px-3 py-2">
							<span className="font-medium text-gray-900">
								{entry.symbol}
							</span>
							<span className="ml-1 text-xs text-gray-400">
								{entry.assetName}
							</span>
						</td>
						<td className="px-3 py-2">
							<TypeBadge type={entry.incomeType} />
						</td>
						<td className="px-3 py-2 text-right font-mono text-gray-700">
							{entry.units.toLocaleString("fr-FR")}
						</td>
						<td className="px-3 py-2 text-right font-mono text-gray-700">
							{fmt(entry.grossAmount)}
						</td>
						<td className="px-3 py-2 text-right font-mono text-gray-500">
							{entry.exempt || !entry.ircmWithheld
								? "—"
								: fmt(entry.ircmWithheld)}
						</td>
						<td className="px-3 py-2 text-right font-mono font-semibold text-gray-900">
							{fmt(entry.netAmount)}
						</td>
						<td className="px-3 py-2">
							<StatusBadge status={entry.status} />
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

// ---------------------------------------------------------------------------
// Coming Soon banner (while backend endpoint is unavailable)
// ---------------------------------------------------------------------------

const ComingSoonBanner: FC = () => (
	<Card className="p-8 text-center">
		<CalendarDays className="h-12 w-12 mx-auto mb-4 text-blue-400" />
		<h2 className="text-lg font-semibold text-gray-800 mb-2">
			Historique des revenus
		</h2>
		<p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
			Cette fonctionnalite est en cours de developpement. Elle affichera
			l&apos;historique complet de vos revenus (coupons, maturites, distributions)
			avec details fiscaux IRCM.
		</p>
		<p className="text-sm text-gray-500 mb-6">
			En attendant, consultez votre{" "}
			<Link
				to="/income-calendar"
				className="text-blue-600 hover:text-blue-700 underline font-medium"
			>
				calendrier de revenus
			</Link>{" "}
			pour voir les paiements projetes.
		</p>
	</Card>
);

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

export const IncomeHistoryView: FC = () => {
	const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
	const [page] = useState(0);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["portfolio-income-history", activeTab, page],
		queryFn: () =>
			assetApi.getPortfolioIncomeHistory(activeTab, page, 20),
		select: (res) => res.data,
		// Treat 404 as "endpoint not yet available" rather than an error to
		// surface; we show the coming-soon banner instead.
		retry: (failureCount, err) => {
			const status = (err as { response?: { status?: number } })?.response
				?.status;
			if (status === 404 || status === 501) return false;
			return failureCount < 2;
		},
	});

	// Detect "endpoint not found" gracefully
	const isEndpointMissing = (() => {
		if (!isError) return false;
		const status = (error as { response?: { status?: number } })?.response
			?.status;
		return status === 404 || status === 501 || status === undefined;
	})();

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				{/* Page header */}
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-800">
						Historique des revenus
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Coupons, maturites et distributions pergus sur votre portefeuille.
					</p>
				</div>

				{/* Loading */}
				{isLoading && (
					<div className="flex justify-center py-16">
						<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
					</div>
				)}

				{/* Endpoint not yet available — show coming soon */}
				{!isLoading && isEndpointMissing && <ComingSoonBanner />}

				{/* Real error */}
				{!isLoading && isError && !isEndpointMissing && (
					<Card className="p-6 text-center">
						<p className="text-sm text-red-600 mb-2">
							Impossible de charger l&apos;historique.
						</p>
						<p className="text-xs text-gray-400">
							{extractErrorMessage(error)}
						</p>
					</Card>
				)}

				{/* Data loaded */}
				{!isLoading && !isError && data && (
					<>
						<SummaryBar
							totalPaid={data.totalPaid}
							totalScheduled={data.totalScheduled}
							totalIrcmWithheld={data.totalIrcmWithheld}
						/>

						{/* Filter tabs */}
						<div className="flex gap-2 mb-4">
							{FILTER_TABS.map((tab) => (
								<button
									key={tab.key}
									type="button"
									onClick={() => setActiveTab(tab.key)}
									className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
										activeTab === tab.key
											? "bg-blue-600 text-white border-blue-600"
											: "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
									}`}
								>
									{tab.label}
								</button>
							))}
						</div>

						<Card className="p-0 overflow-hidden">
							{data.content.length === 0 ? (
								<div className="py-12 text-center">
									<p className="text-sm text-gray-500">
										Aucun revenu{" "}
										{activeTab === "PAID"
											? "percu"
											: activeTab === "SCHEDULED"
												? "planifie"
												: "enregistre"}{" "}
										pour le moment.
									</p>
									{activeTab === "ALL" && (
										<p className="text-xs text-gray-400 mt-1">
											Investissez dans des actifs generateurs de revenus pour
											voir votre historique ici.
										</p>
									)}
								</div>
							) : (
								<IncomeTable entries={data.content} />
							)}
						</Card>
					</>
				)}
			</main>
		</div>
	);
};
