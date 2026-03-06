import { FC } from "react";

interface TableSkeletonProps {
	rows?: number;
	cols?: number;
}

export const TableSkeleton: FC<TableSkeletonProps> = ({
	rows = 5,
	cols = 6,
}) => {
	return (
		<div className="bg-white rounded-lg shadow overflow-hidden">
			<div className="animate-pulse">
				{/* Header */}
				<div className="bg-gray-50 px-6 py-3 flex gap-4">
					{Array.from({ length: cols }, (_, i) => `header-${i}`).map((key) => (
						<div key={key} className="h-4 bg-gray-200 rounded flex-1" />
					))}
				</div>
				{/* Rows */}
				{Array.from({ length: rows }, (_, i) => `row-${i}`).map((rowKey) => (
					<div
						key={rowKey}
						className="px-6 py-4 flex gap-4 border-b border-gray-100"
					>
						{Array.from({ length: cols }, (_, i) => `${rowKey}-col-${i}`).map(
							(colKey) => (
								<div key={colKey} className="h-4 bg-gray-100 rounded flex-1" />
							),
						)}
					</div>
				))}
			</div>
		</div>
	);
};
