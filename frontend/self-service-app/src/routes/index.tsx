import { Button } from "@fineract-apps/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Smartphone, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Marquee } from "../components/landing/Marquee";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
			{/* Header */}
			<header className="container mx-auto px-4 py-6">
				<nav className="flex items-center justify-between">
					<span className="text-2xl font-bold text-blue-600">
						{t("app.name")}
					</span>
					<div className="hidden sm:flex items-center gap-4">
						<Link
							to="/register"
							className="text-gray-600 hover:text-gray-900 font-medium"
						>
							{t("auth.register")}
						</Link>
						<Link to="/login">
							<Button variant="default" size="sm">
								{t("auth.login")}
							</Button>
						</Link>
					</div>
				</nav>
			</header>

			{/* Hero Section */}
			<main className="container mx-auto px-4 py-16 flex-grow flex flex-col justify-center">
				<div className="max-w-3xl mx-auto text-center">
					<h1 className="hidden sm:block text-2xl md:text-3xl font-bold text-gray-900 mb-6">
						{t("app.tagline")}
					</h1>
					<p className="hidden sm:block text-xl text-gray-600 mb-8">
						Send and receive money instantly with MTN Mobile Money, Orange
						Money, and bank transfers. Secure passwordless authentication with
						Face ID and fingerprint.
					</p>
					<div className="w-full max-w-xs mx-auto">
						<Link to="/login" className="w-full">
							<Button size="lg" className="w-full">
								{t("auth.login")}
							</Button>
						</Link>
						<p className="text-center text-gray-500 mt-4">
							{t("register.haveAccount")}{" "}
							<Link to="/register" className="text-blue-600 hover:underline">
								{t("auth.register")}
							</Link>
						</p>
					</div>
				</div>

				{/* Features */}
				<div className="hidden md:grid md:grid-cols-3 gap-8 mt-20">
					<div className="card text-center">
						<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Smartphone className="w-8 h-8 text-blue-600" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Mobile Money</h3>
						<p className="text-gray-600">
							Deposit and withdraw using MTN Mobile Money and Orange Money
							instantly.
						</p>
					</div>

					<div className="card text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Shield className="w-8 h-8 text-green-600" />
						</div>
						<h3 className="text-xl font-semibold mb-2">
							Passwordless Security
						</h3>
						<p className="text-gray-600">
							No passwords to remember. Use Face ID, Touch ID, or your security
							key.
						</p>
					</div>

					<div className="card text-center">
						<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Wallet className="w-8 h-8 text-purple-600" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Bank Transfers</h3>
						<p className="text-gray-600">
							Transfer to UBA and Afriland bank accounts after verification.
						</p>
					</div>
				</div>
			</main>

			{/* Marquee */}
			<Marquee />

			{/* Footer */}
			<footer className="hidden sm:block container mx-auto px-4 py-8 text-center text-gray-500">
				<p>&copy; 2026 Webank. All rights reserved.</p>
			</footer>
		</div>
	);
}
