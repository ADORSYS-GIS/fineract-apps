import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import { Home, Wallet, ArrowDownCircle, ArrowUpCircle, Shield, LogOut, Menu, X, CreditCard } from "lucide-react";
import { useState } from "react";
import { OfflineIndicator, InstallPrompt, UpdatePrompt } from "@/components/pwa";
import { BottomNav } from "@/components/navigation";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show layout on login/register/callback pages
  const publicPaths = ["/", "/register", "/callback"];
  const currentPath = window.location.pathname.replace("/self-service", "") || "/";
  const isPublicPage = publicPaths.includes(currentPath);

  if (isPublicPage) {
    return <Outlet />;
  }

  // Show loading while checking auth
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!auth.isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const menuItems = [
    { name: t("nav.dashboard"), path: "/dashboard", icon: Home },
    { name: t("nav.account", { defaultValue: "Account" }), path: "/account", icon: CreditCard },
    { name: t("nav.deposit"), path: "/deposit", icon: ArrowDownCircle },
    { name: t("nav.withdraw"), path: "/withdraw", icon: ArrowUpCircle },
    { name: t("nav.transactions"), path: "/transactions", icon: Wallet },
    { name: t("nav.kyc"), path: "/kyc", icon: Shield },
  ];

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <span className="text-xl font-bold text-blue-600">{t("app.name")}</span>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={`/self-service${item.path}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {auth.user?.profile?.given_name?.[0] || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {auth.user?.profile?.name || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {auth.user?.profile?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>{t("auth.logout")}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white shadow-sm h-16 flex items-center px-4">
          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 text-lg font-semibold text-gray-900">
            {t("app.name")}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom navigation */}
        <BottomNav />
      </div>

      {/* PWA Components */}
      <OfflineIndicator />
      <InstallPrompt />
      <UpdatePrompt />
    </div>
  );
}
