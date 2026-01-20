import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Smartphone, Shield, Wallet } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [auth.isAuthenticated, navigate]);

  const handleLogin = () => {
    auth.signinRedirect();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">{t("app.name")}</span>
          <div className="flex items-center gap-4">
            <a
              href="/self-service/register"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              {t("auth.register")}
            </a>
            <button onClick={handleLogin} className="btn-primary">
              {t("auth.login")}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t("app.tagline")}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Send and receive money instantly with MTN Mobile Money, Orange Money, and bank transfers.
            Secure passwordless authentication with Face ID and fingerprint.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleLogin} className="btn-primary text-lg px-8 py-3">
              {t("auth.login")}
            </button>
            <a href="/self-service/register" className="btn-outline text-lg px-8 py-3">
              {t("auth.register")}
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mobile Money</h3>
            <p className="text-gray-600">
              Deposit and withdraw using MTN Mobile Money and Orange Money instantly.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Passwordless Security</h3>
            <p className="text-gray-600">
              No passwords to remember. Use Face ID, Touch ID, or your security key.
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

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p>&copy; 2024 Webank. All rights reserved.</p>
      </footer>
    </div>
  );
}
