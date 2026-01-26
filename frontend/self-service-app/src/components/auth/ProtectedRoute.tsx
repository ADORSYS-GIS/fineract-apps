import { useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredKycTier?: number;
	fallbackPath?: string;
}

export function ProtectedRoute({
	children,
	requiredKycTier,
	fallbackPath = "/",
}: ProtectedRouteProps) {
	const auth = useAuth();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const kycTier = (auth.user?.profile?.kyc_tier as number) || 1;

	useEffect(() => {
		if (!auth.isLoading && !auth.isAuthenticated) {
			navigate({ to: fallbackPath });
		}
	}, [auth.isLoading, auth.isAuthenticated, navigate, fallbackPath]);

	// Show loading while checking auth
	if (auth.isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
					<p className="mt-4 text-gray-600">{t("common.loading")}</p>
				</div>
			</div>
		);
	}

	// Not authenticated
	if (!auth.isAuthenticated) {
		return null; // Will redirect in useEffect
	}

	// Check KYC tier if required
	if (requiredKycTier && kycTier < requiredKycTier) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
				<div className="card max-w-md w-full text-center">
					<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<ShieldAlert className="w-8 h-8 text-yellow-600" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Verification Required
					</h2>
					<p className="text-gray-500 mb-6">
						This feature requires Tier {requiredKycTier} verification. Your
						current tier is {kycTier}.
					</p>
					<a href="/self-service/kyc" className="btn-primary inline-block">
						Complete Verification
					</a>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
