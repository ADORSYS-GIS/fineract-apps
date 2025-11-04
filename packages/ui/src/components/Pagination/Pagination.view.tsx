import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC } from "react";
import { Button } from "../Button";
import { PaginationProps } from "./Pagination.types";
import { usePagination } from "./usePagination";

export const PaginationView: FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const { handlePrevious, handleNext } = usePagination({
		currentPage,
		totalPages,
		onPageChange,
	});

	return (
		<div className="flex items-center justify-center space-x-4">
			<Button
				variant="ghost"
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className="rounded-full p-2"
			>
				<ChevronLeft className="h-6 w-6" />
			</Button>
			<span>
				Page {currentPage} of {totalPages}
			</span>
			<Button
				variant="ghost"
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className="rounded-full p-2"
			>
				<ChevronRight className="h-6 w-6" />
			</Button>
		</div>
	);
};
