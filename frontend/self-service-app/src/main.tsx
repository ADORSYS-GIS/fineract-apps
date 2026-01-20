import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';

// OIDC Configuration
const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_OIDC_POST_LOGOUT_URI,
  scope: 'openid profile email offline_access',
  response_type: 'code',
  // PKCE is enabled by default in oidc-client-ts
};

// Placeholder App component
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Webank Self-Service
        </h1>
        <p className="text-gray-600 text-center">
          Customer self-service banking portal with WebAuthn passwordless authentication.
        </p>
        <p className="text-sm text-gray-400 text-center mt-4">
          Coming soon...
        </p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
