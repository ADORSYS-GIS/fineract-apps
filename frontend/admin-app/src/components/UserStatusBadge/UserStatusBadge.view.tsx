import { cn } from "@fineract-apps/ui";
import type { UserStatusBadgeProps } from "./UserStatusBadge.types";

export function UserStatusBadge({ isActive, className }: UserStatusBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
				isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
				className,
			)}
		>
			<span
				className={cn(
					"w-1.5 h-1.5 rounded-full",
					isActive ? "bg-green-600" : "bg-gray-400",
				)}
			/>
			{isActive ? "Active" : "Inactive"}
		</span>
	);
}
