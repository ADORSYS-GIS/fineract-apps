import { Button } from "@fineract-apps/ui";
import { PageHeaderProps } from "./PageHeader.types";

export function PageHeaderView({
	title,
	subtitle,
	actions = [],
	className = "",
}: PageHeaderProps) {
	return (
		<div className={`flex items-center justify-between mb-6 ${className}`}>
			<div>
				<h1 className="text-2xl font-bold text-gray-900">{title}</h1>
				{subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
			</div>
			{actions.length > 0 && (
				<div className="flex gap-2">
					{actions.map((action, index) => (
						<Button
							key={index}
							onClick={action.onClick}
							variant={action.variant || "default"}
							disabled={action.disabled}
							className="flex items-center gap-2"
						>
							{action.icon}
							{action.label}
						</Button>
					))}
				</div>
			)}
		</div>
	);
}
