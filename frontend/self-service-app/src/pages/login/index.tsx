import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

export function LoginPage() {
	const { t } = useTranslation();
	const auth = useAuth();

	const handleLogin = () => {
		auth.signinRedirect();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-gray-900">
						{t("auth.login")}
					</h1>
					<p className="text-gray-500 mt-2">
						{t("login.subtitle", "Access your account")}
					</p>
				</div>
				<Button onClick={handleLogin} className="w-full" variant="default">
					{t("auth.continueToLogin", "Continue to Login")}
				</Button>
				<p className="text-center text-gray-500 mt-6">
					{t("login.noAccount", "Don't have an account?")}{" "}
					<Link to="/register" className="text-blue-600 hover:underline">
						{t("auth.register")}
					</Link>
				</p>
			</div>
		</div>
	);
}
