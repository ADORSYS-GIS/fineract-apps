import { CheckCircle, Info, X, XCircle } from "lucide-react";
import { type Toast, useToast } from "./useToast";

export function ToastContainer() {
	const { toasts, removeToast } = useToast();

	if (toasts.length === 0) return null;

	return (
		<div className="fixed top-4 right-4 z-50 space-y-2">
			{toasts.map((toast) => (
				<ToastItem
					key={toast.id}
					toast={toast}
					onClose={() => removeToast(toast.id)}
				/>
			))}
		</div>
	);
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
	const icons = {
		success: <CheckCircle className="w-5 h-5 text-green-600" />,
		error: <XCircle className="w-5 h-5 text-red-600" />,
		info: <Info className="w-5 h-5 text-blue-600" />,
	};

	const backgrounds = {
		success: "bg-green-50 border-green-200",
		error: "bg-red-50 border-red-200",
		info: "bg-blue-50 border-blue-200",
	};

	const textColors = {
		success: "text-green-800",
		error: "text-red-800",
		info: "text-blue-800",
	};

	return (
		<div
			className={`flex items-center gap-3 min-w-80 max-w-md p-4 rounded-lg border shadow-lg ${backgrounds[toast.type]} animate-slide-in`}
		>
			{icons[toast.type]}
			<p className={`flex-1 text-sm font-medium ${textColors[toast.type]}`}>
				{toast.message}
			</p>
			<button
				onClick={onClose}
				className="text-gray-400 hover:text-gray-600 transition-colors"
				aria-label="Close notification"
			>
				<X className="w-4 h-4" />
			</button>
		</div>
	);
}
