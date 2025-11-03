import { X } from "lucide-react";
import { FC, ReactNode } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	size?: "md" | "lg";
}

export const Modal: FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	size = "md",
}) => {
	if (!isOpen) return null;

	const sizeClasses = {
		md: "max-w-md",
		lg: "max-w-5xl",
	};

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				className="fixed inset-0 z-40 bg-black/40"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				aria-label="Close modal"
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
				<dialog
					className={`relative bg-white rounded-t-2xl md:rounded-lg p-6 w-full ${sizeClasses[size]} shadow-lg`}
					open={isOpen}
					onClose={onClose}
				>
					<button
						type="button"
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hidden md:block"
						onClick={onClose}
					>
						<X className="w-6 h-6" />
					</button>
					<div className="hidden md:block">
						<h2 className="text-xl font-bold text-center mb-6">{title}</h2>
					</div>
					<div className="md:hidden flex justify-center mb-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>
					<div className="md:hidden">
						<h2 className="text-xl font-bold text-center mb-6">{title}</h2>
					</div>
					{children}
				</dialog>
			</div>
		</>
	);
};
