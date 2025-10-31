import { FC } from "react";
import { PaginationProps } from "./Pagination.types";
import { PaginationView } from "./Pagination.view";

export const Pagination: FC<PaginationProps> = (props) => {
	return <PaginationView {...props} />;
};
