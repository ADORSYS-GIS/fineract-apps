import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
  variant?: "primary" | "danger" | "text";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  onLogoutStart?: () => void;
}

export function LogoutButton({
  className = "",
  variant = "danger",
  size = "md",
  showIcon = true,
  onLogoutStart,
}: LogoutButtonProps) {
  const auth = useAuth();
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    onLogoutStart?.();

    try {
      await auth.signoutRedirect();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "text-red-600 hover:bg-red-50",
    text: "text-gray-600 hover:text-gray-800 hover:underline",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {isLoggingOut ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : showIcon ? (
        <LogOut className="w-4 h-4" />
      ) : null}
      <span>{t("auth.logout")}</span>
    </button>
  );
}
