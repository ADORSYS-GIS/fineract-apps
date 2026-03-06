import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
	assetApi,
	type PaymentResultResponse,
	type ScheduledPaymentDetailResponse,
} from "@/services/assetApi";

export interface PaymentResultsProps {
	paymentId: number;
	schedule: ScheduledPaymentDetailResponse | undefined;
	results: PaymentResultResponse[];
	totalPages: number;
	totalElements: number;
	isLoading: boolean;
	currentPage: number;
	setPage: (page: number) => void;
}

export const usePaymentResults = (): PaymentResultsProps => {
	const { paymentId } = useParams({
		from: "/payment-results/$paymentId",
	});
	const id = Number(paymentId);
	const [page, setPage] = useState(0);
	const pageSize = 20;

	const { data: schedule, isLoading: scheduleLoading } = useQuery({
		queryKey: ["scheduled-payment-detail", id],
		queryFn: () => assetApi.getScheduledPaymentDetail(id),
		select: (res) => res.data,
	});

	const { data: results, isLoading: resultsLoading } = useQuery({
		queryKey: ["payment-results", id, page],
		queryFn: () =>
			assetApi.getScheduledPaymentResults(id, { page, size: pageSize }),
		select: (res) => res.data,
		enabled: !!schedule,
	});

	return {
		paymentId: id,
		schedule,
		results: results?.content ?? [],
		totalPages: results?.totalPages ?? 0,
		totalElements: results?.totalElements ?? 0,
		isLoading: scheduleLoading || resultsLoading,
		currentPage: page,
		setPage,
	};
};
