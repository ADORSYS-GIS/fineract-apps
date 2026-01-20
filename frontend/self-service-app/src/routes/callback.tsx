import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/callback")({
  component: CallbackPage,
});

function CallbackPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // When authentication is complete, redirect to dashboard
    if (auth.isAuthenticated && !auth.isLoading) {
      navigate({ to: "/dashboard" });
    }

    // If there's an error, redirect to home
    if (auth.error) {
      console.error("Authentication error:", auth.error);
      navigate({ to: "/" });
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t("common.loading")}</p>
        <p className="text-sm text-gray-400 mt-2">Completing authentication...</p>
      </div>
    </div>
  );
}
