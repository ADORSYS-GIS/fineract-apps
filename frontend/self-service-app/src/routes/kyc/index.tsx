import { createFileRoute } from "@tanstack/react-router";
import {
	AlertCircle,
	Check,
	ChevronRight,
	Clock,
	Shield,
	Upload,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

export const Route = createFileRoute("/kyc/")({
	component: KycPage,
});

interface DocumentStatus {
	type: string;
	status: "pending" | "uploaded" | "verified" | "rejected";
	uploadedAt?: string;
}

function KycPage() {
	const auth = useAuth();
	const { t } = useTranslation();

	const kycTier = (auth.user?.profile?.kyc_tier as number) || 1;
	const kycStatus = (auth.user?.profile?.kyc_status as string) || "pending";

	const currency = "XAF";

	const tiers = [
		{
			level: 1,
			name: t("kyc.tier1"),
			limits: { daily: 50000, perTransaction: 25000 },
			requirements: ["Phone verification", "Email verification"],
		},
		{
			level: 2,
			name: t("kyc.tier2"),
			limits: { daily: 500000, perTransaction: 200000 },
			requirements: [
				t("kyc.documents.id_front"),
				t("kyc.documents.id_back"),
				t("kyc.documents.selfie_with_id"),
			],
		},
	];

	// Mock document statuses
	const documents: DocumentStatus[] = [
		{ type: "id_front", status: kycTier >= 2 ? "verified" : "pending" },
		{ type: "id_back", status: kycTier >= 2 ? "verified" : "pending" },
		{ type: "selfie_with_id", status: kycTier >= 2 ? "verified" : "pending" },
	];

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("fr-CM", {
			style: "decimal",
			minimumFractionDigits: 0,
		}).format(value);
	};

	const getStatusIcon = (status: DocumentStatus["status"]) => {
		switch (status) {
			case "verified":
				return <Check className="w-5 h-5 text-green-600" />;
			case "uploaded":
				return <Clock className="w-5 h-5 text-yellow-600" />;
			case "rejected":
				return <AlertCircle className="w-5 h-5 text-red-600" />;
			default:
				return <Upload className="w-5 h-5 text-gray-400" />;
		}
	};

	const getStatusColor = (status: DocumentStatus["status"]) => {
		switch (status) {
			case "verified":
				return "bg-green-100 text-green-700";
			case "uploaded":
				return "bg-yellow-100 text-yellow-700";
			case "rejected":
				return "bg-red-100 text-red-700";
			default:
				return "bg-gray-100 text-gray-500";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">{t("kyc.title")}</h1>
				<p className="text-gray-500 mt-1">{t("kyc.subtitle")}</p>
			</div>

			{/* Current Status */}
			<div className="card">
				<div className="flex items-center gap-4">
					<div
						className={`w-16 h-16 rounded-full flex items-center justify-center ${
							kycStatus === "approved"
								? "bg-green-100"
								: kycStatus === "under_review"
									? "bg-yellow-100"
									: "bg-blue-100"
						}`}
					>
						<Shield
							className={`w-8 h-8 ${
								kycStatus === "approved"
									? "text-green-600"
									: kycStatus === "under_review"
										? "text-yellow-600"
										: "text-blue-600"
							}`}
						/>
					</div>
					<div>
						<p className="text-sm text-gray-500">{t("dashboard.kycStatus")}</p>
						<p className="text-xl font-bold text-gray-900">
							{t("dashboard.tier", { tier: kycTier })}
						</p>
						<span
							className={`inline-block text-sm px-3 py-1 rounded-full mt-1 ${getStatusColor(kycStatus as DocumentStatus["status"])}`}
						>
							{t(`kyc.status.${kycStatus}`)}
						</span>
					</div>
				</div>
			</div>

			{/* Tier Comparison */}
			<div className="grid md:grid-cols-2 gap-6">
				{tiers.map((tier) => (
					<div
						key={tier.level}
						className={`card relative ${
							kycTier >= tier.level ? "border-green-200 bg-green-50/50" : ""
						}`}
					>
						{kycTier >= tier.level && (
							<div className="absolute top-4 right-4">
								<Check className="w-6 h-6 text-green-600" />
							</div>
						)}
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							{t("dashboard.tier", { tier: tier.level })} - {tier.name}
						</h3>

						<div className="space-y-3 mb-4">
							<div className="flex justify-between">
								<span className="text-sm text-gray-500">
									{t("transactions.limits.daily")}
								</span>
								<span className="font-medium">
									{formatCurrency(tier.limits.daily)} {currency}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-gray-500">
									{t("transactions.limits.perTransaction")}
								</span>
								<span className="font-medium">
									{formatCurrency(tier.limits.perTransaction)} {currency}
								</span>
							</div>
						</div>

						<div className="border-t pt-4">
							<p className="text-sm font-medium text-gray-700 mb-2">
								Requirements:
							</p>
							<ul className="space-y-1">
								{tier.requirements.map((req) => (
									<li
										key={req}
										className="text-sm text-gray-500 flex items-center gap-2"
									>
										<Check className="w-4 h-4 text-green-600" />
										{req}
									</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>

			{/* Documents Section (only show if not Tier 2) */}
			{kycTier < 2 && (
				<div className="card">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Required Documents for Tier 2
					</h2>
					<div className="space-y-3">
						{documents.map((doc) => (
							<a
								key={doc.type}
								href="/self-service/kyc/upload"
								className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
							>
								<div className="flex items-center gap-3">
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center ${
											doc.status === "verified"
												? "bg-green-100"
												: doc.status === "uploaded"
													? "bg-yellow-100"
													: "bg-gray-100"
										}`}
									>
										{getStatusIcon(doc.status)}
									</div>
									<div>
										<p className="font-medium text-gray-900">
											{t(`kyc.documents.${doc.type}`)}
										</p>
										<p className="text-sm text-gray-500">
											{t(`kyc.status.${doc.status}`)}
										</p>
									</div>
								</div>
								<ChevronRight className="w-5 h-5 text-gray-400" />
							</a>
						))}
					</div>

					<div className="mt-6">
						<a
							href="/self-service/kyc/upload"
							className="btn-primary w-full text-center block"
						>
							{t("kyc.upload")}
						</a>
					</div>
				</div>
			)}

			{/* Verified Message */}
			{kycTier >= 2 && (
				<div className="card bg-green-50 border-green-200">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
							<Check className="w-6 h-6 text-green-600" />
						</div>
						<div>
							<h3 className="font-semibold text-green-800">Fully Verified</h3>
							<p className="text-green-600">
								You have access to all features and highest transaction limits.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
