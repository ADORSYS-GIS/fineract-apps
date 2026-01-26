import { Loader2, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

interface LoginButtonProps {
	className?: string;
	variant?: "primary" | "outline" | "text";
	size?: "sm" | "md" | "lg";
	showIcon?: boolean;
}

export function LoginButton({
	className = "",
	variant = "primary",
	size = "md",
	showIcon = true,
}: LoginButtonProps) {
	const auth = useAuth();
	const { t } = useTranslation();

	const handleLogin = () => {
		auth.signinRedirect();
	};

	const baseStyles =
		"inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

	const variantStyles = {
		primary: "bg-blue-600 text-white hover:bg-blue-700",
		outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
		text: "text-blue-600 hover:text-blue-700 hover:underline",
	};

	const sizeStyles = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2",
		lg: "px-6 py-3 text-lg",
	};

	const isLoading = auth.isLoading;

	return (
		<button
			onClick={handleLogin}
			disabled={isLoading}
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
		>
			{isLoading ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : showIcon ? (
				<LogIn className="w-4 h-4" />
			) : null}
			<span>{t("auth.login")}</span>
		</button>
	);
}
