import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "react-oidc-context";
import { Toaster } from "react-hot-toast";

import i18n from "./lib/i18n";
import { routeTree } from "./routeTree.gen";
import "./index.css";

// OIDC Configuration
const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY || "http://localhost:8080/realms/fineract",
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID || "self-service-app",
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI || `${window.location.origin}/self-service/callback`,
  post_logout_redirect_uri: import.meta.env.VITE_OIDC_POST_LOGOUT_URI || `${window.location.origin}/self-service`,
  scope: "openid profile email offline_access",
  response_type: "code",
  automaticSilentRenew: true,
  loadUserInfo: true,
};

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// TanStack Router
const router = createRouter({
  routeTree,
  basepath: "/self-service",
  context: {
    queryClient,
  },
});

// Type declaration for router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<LoadingFallback />}>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
          </Suspense>
        </I18nextProvider>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
