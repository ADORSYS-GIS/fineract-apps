import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (message: string, type: ToastType) => void;
	removeToast: (id: string) => void;
	success: (message: string) => void;
	error: (message: string) => void;
	info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((message: string, type: ToastType) => {
		const id = Date.now().toString();
		setToasts((prev) => [...prev, { id, message, type }]);

		// Auto-remove after 5 seconds
		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 5000);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const success = useCallback(
		(message: string) => addToast(message, "success"),
		[addToast],
	);
	const error = useCallback(
		(message: string) => addToast(message, "error"),
		[addToast],
	);
	const info = useCallback(
		(message: string) => addToast(message, "info"),
		[addToast],
	);

	return (
		<ToastContext.Provider
			value={{ toasts, addToast, removeToast, success, error, info }}
		>
			{children}
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}
