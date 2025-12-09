export interface PasswordResetModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	userName: string;
	userEmail?: string;
	isLoading?: boolean;
	error?: string | null;
}
