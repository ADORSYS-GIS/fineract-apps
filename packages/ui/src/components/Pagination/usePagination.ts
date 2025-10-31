import { PaginationProps } from "./Pagination.types";

export const usePagination = ({
	currentPage,
	onPageChange,
}: PaginationProps) => {
	const handlePrevious = () => {
		onPageChange(currentPage - 1);
	};

	const handleNext = () => {
		onPageChange(currentPage + 1);
	};

	return {
		handlePrevious,
		handleNext,
	};
};
