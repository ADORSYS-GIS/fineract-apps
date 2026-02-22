import { Button } from "@fineract-apps/ui";
import { type FC } from "react";

interface ErrorFallbackProps {
	error?: Error | null;
	message?: string;
	onRetry?: () => void;
}

export const ErrorFallback: FC<ErrorFallbackProps> = ({
	error,
	message,
	onRetry,
}) => {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-4">
			<div className="text-red-500 text-5xl mb-4">!</div>
			<h2 className="text-lg font-semibold text-gray-800 mb-2">
				Something went wrong
			</h2>
			<p className="text-sm text-gray-500 mb-4 text-center max-w-md">
				{message || error?.message || "An unexpected error occurred."}
			</p>
			{onRetry && (
				<Button onClick={onRetry} variant="outline">
					Try again
				</Button>
			)}
		</div>
	);
};
