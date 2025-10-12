import { BackButton } from "@/components/BackButton";

export const PageHeader = ({
	title,
	children,
	to,
}: {
	title?: string;
	children?: React.ReactNode;
	to?: string;
}) => {
	return (
		<div className="flex items-center justify-between mb-6">
			<div className="flex items-center">
				<BackButton to={to} />
			</div>
			{title && (
				<div className="flex-1 text-center">
					<h1 className="text-2xl font-bold">{title}</h1>
				</div>
			)}
			<div className="flex items-center">{children}</div>
		</div>
	);
};
