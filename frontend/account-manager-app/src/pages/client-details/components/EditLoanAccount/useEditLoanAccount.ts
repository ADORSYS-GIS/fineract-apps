import {
	LoansService,
	PostLoansRequest as PostLoansRequestType,
	PutLoansLoanIdRequest,
	PutLoansLoanIdResponse,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	LoanDetailsFormValues,
} from "@/pages/loan/create-loan-account/CreateLoanAccount.schema";
import {
	LoanDetailsTemplate,
	LoanRepaymentSchedule,
	PostLoansRequest,
} from "@/pages/loan/create-loan-account/CreateLoanAccount.types";

export const useEditLoanAccount = (loanId: number, onClose: () => void) => {
	const queryClient = useQueryClient();
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null,
	);
	const [repaymentSchedule, setRepaymentSchedule] =
		useState<LoanRepaymentSchedule | null>(null);

	const { data: loanData, isLoading: isLoanDataLoading } = useQuery({
		queryKey: ["loan", loanId],
		queryFn: () => LoansService.getV1LoansByLoanId({ loanId }),
	});

	const createEditLoanPayload = (
		values: LoanDetailsFormValues,
	): PutLoansLoanIdRequest => ({
		productId: values.loanProductId ? Number(values.loanProductId) : 0,
		principal: values.principal ? Number(values.principal) : 0,
		loanTermFrequency: values.loanTermFrequency
			? Number(values.loanTermFrequency)
			: 0,
		loanTermFrequencyType: values.loanTermFrequencyType,
		numberOfRepayments: values.numberOfRepayments
			? Number(values.numberOfRepayments)
			: 0,
		repaymentEvery: values.repaymentEvery ? Number(values.repaymentEvery) : 0,
		repaymentFrequencyType: values.repaymentFrequencyType,
		interestRatePerPeriod: values.interestRatePerPeriod
			? Number(values.interestRatePerPeriod)
			: 0,
		amortizationType: values.amortizationType,
		interestType: values.interestType,
		interestCalculationPeriodType: values.interestCalculationPeriodType,
		transactionProcessingStrategyCode: values.transactionProcessingStrategyCode,
		loanType: "individual",
		locale: "en",
		dateFormat: "dd MMMM yyyy",
		submittedOnDate: values.submittedOnDate
			? format(new Date(values.submittedOnDate), "dd MMMM yyyy")
			: undefined,
		expectedDisbursementDate: values.expectedDisbursementDate
			? format(new Date(values.expectedDisbursementDate), "dd MMMM yyyy")
			: undefined,
		charges: [],
	});

	const editLoanAccountMutation = useMutation<
		PutLoansLoanIdResponse,
		Error,
		PutLoansLoanIdRequest
	>({
		mutationFn: (loanPayload) =>
			LoansService.putV1LoansByLoanId({
				loanId,
				requestBody: loanPayload,
			}),
		onSuccess: () => {
			toast.success("Loan account updated successfully");
			queryClient.invalidateQueries({ queryKey: ["accounts", loanData?.clientId] });
			onClose();
		},
		onError: (error) => {
			toast.error(`Failed to update loan account: ${error.message}`);
		},
	});

	const formik = useFormik<LoanDetailsFormValues>({
		initialValues: {
			loanProductId: 0,
			externalId: "",
			loanOfficerId: undefined,
			loanPurposeId: undefined,
			fundId: undefined,
			submittedOnDate: new Date().toISOString().split("T")[0],
			expectedDisbursementDate: new Date().toISOString().split("T")[0],
			principal: 0,
			loanTermFrequency: 0,
			loanTermFrequencyType: undefined,
			numberOfRepayments: 0,
			repaymentEvery: 0,
			repaymentFrequencyType: undefined,
			interestRatePerPeriod: 0,
			amortizationType: undefined,
			interestType: undefined,
			interestCalculationPeriodType: undefined,
			transactionProcessingStrategyCode: "",
			charges: [],
		},
		onSubmit: (values) => {
			const payload = createEditLoanPayload(values);
			editLoanAccountMutation.mutate(payload);
		},
	});

	const { values, setValues } = formik;

	useEffect(() => {
		if (loanData) {
			setValues({
				loanProductId: loanData.loanProductId ?? 0,
				externalId: loanData.externalId ?? "",
				loanOfficerId: loanData.loanOfficerId,
				loanPurposeId: loanData.loanPurposeId,
				fundId: undefined,
				submittedOnDate: loanData.timeline?.submittedOnDate
					? format(new Date(loanData.timeline.submittedOnDate), "yyyy-MM-dd")
					: "",
				expectedDisbursementDate: loanData.timeline?.expectedDisbursementDate
					? format(
							new Date(loanData.timeline.expectedDisbursementDate),
							"yyyy-MM-dd",
					  )
					: "",
				principal: loanData.principal ?? 0,
				loanTermFrequency: loanData.termFrequency ?? 0,
				loanTermFrequencyType: loanData.termPeriodFrequencyType?.id,
				numberOfRepayments: loanData.numberOfRepayments ?? 0,
				repaymentEvery: loanData.repaymentEvery ?? 0,
				repaymentFrequencyType: loanData.repaymentFrequencyType?.id,
				interestRatePerPeriod: loanData.interestRatePerPeriod ?? 0,
				amortizationType: loanData.amortizationType?.id,
				interestType: loanData.interestType?.id,
				interestCalculationPeriodType: loanData.interestCalculationPeriodType?.id,
				transactionProcessingStrategyCode:
					loanData.transactionProcessingStrategyCode ?? "",
				charges:
					loanData.charges?.map((charge) => ({
						id: charge.chargeId ?? 0,
						name: charge.name ?? "",
						amount: charge.amount ?? 0,
						chargeTimeType: {
							id: charge.chargeTimeType?.id,
							value: charge.chargeTimeType?.value,
							code: charge.chargeTimeType?.code,
						},
						chargeCalculationType: {
							id: charge.chargeCalculationType?.id,
							value: charge.chargeCalculationType?.value,
							code: charge.chargeCalculationType?.code,
						},
					})) ?? [],
			});
		}
	}, [loanData, setValues]);

	const { data: loanTemplate, isLoading } = useQuery({
		queryKey: ["loan-template", loanData?.clientId],
		queryFn: () =>
			LoansService.getV1LoansTemplate({
				clientId: Number(loanData?.clientId),
				templateType: "individual",
			}),
		enabled: !!loanData?.clientId,
	});

	const { data: loanDetails, isLoading: isLoadingLoanDetails } =
		useQuery<LoanDetailsTemplate>({
			queryKey: ["loan-details", loanData?.clientId, selectedProductId],
			queryFn: () =>
				LoansService.getV1LoansTemplate({
					clientId: Number(loanData?.clientId),
					productId: selectedProductId!,
					templateType: "individual",
				}) as Promise<LoanDetailsTemplate>,
			enabled: !!selectedProductId,
		});

	const calculateLoanScheduleMutation = useMutation<
		LoanRepaymentSchedule,
		Error,
		PostLoansRequest
	>({
		mutationFn: (loanPayload) =>
			LoansService.postV1Loans({
				command: "calculateLoanSchedule",
				requestBody: loanPayload,
			}) as unknown as Promise<LoanRepaymentSchedule>,
		onSuccess: (data) => {
			setRepaymentSchedule(data);
			toast.success("Repayment schedule calculated successfully");
		},
		onError: (error) => {
			toast.error(`Failed to calculate repayment schedule: ${error.message}`);
		},
	});

	const createLoanPayload = (
		values: LoanDetailsFormValues,
	): PostLoansRequestType => ({
		clientId: loanData?.clientId,
		productId: values.loanProductId ? Number(values.loanProductId) : 0,
		principal: values.principal ? Number(values.principal) : 0,
		loanTermFrequency: values.loanTermFrequency
			? Number(values.loanTermFrequency)
			: 0,
		loanTermFrequencyType: values.loanTermFrequencyType,
		numberOfRepayments: values.numberOfRepayments
			? Number(values.numberOfRepayments)
			: 0,
		repaymentEvery: values.repaymentEvery ? Number(values.repaymentEvery) : 0,
		repaymentFrequencyType: values.repaymentFrequencyType,
		interestRatePerPeriod: values.interestRatePerPeriod
			? Number(values.interestRatePerPeriod)
			: 0,
		amortizationType: values.amortizationType,
		interestType: values.interestType,
		interestCalculationPeriodType: values.interestCalculationPeriodType,
		transactionProcessingStrategyCode: values.transactionProcessingStrategyCode,
		loanType: "individual",
		locale: "en",
		dateFormat: "dd MMMM yyyy",
		submittedOnDate: values.submittedOnDate
			? format(new Date(values.submittedOnDate), "dd MMMM yyyy")
			: undefined,
		expectedDisbursementDate: values.expectedDisbursementDate
			? format(new Date(values.expectedDisbursementDate), "dd MMMM yyyy")
			: undefined,
		charges: values.charges?.map((charge) => ({
			chargeId: charge.id,
			amount: charge.amount,
		})),
	});

	const handleCalculateSchedule = () => {
		const payload = createLoanPayload(values);
		calculateLoanScheduleMutation.mutate(payload);
	};

	useEffect(() => {
		if (values.loanProductId) {
			setSelectedProductId(Number(values.loanProductId));
		}
	}, [values.loanProductId]);

	return {
		formik,
		loanTemplate,
		isLoading: isLoading || isLoanDataLoading,
		loanDetails,
		isLoadingLoanDetails,
		repaymentSchedule,
		isCalculatingSchedule: calculateLoanScheduleMutation.isPending,
		handleCalculateSchedule,
		handleSubmit: formik.handleSubmit,
		isSubmitting: editLoanAccountMutation.isPending,
		onClose,
	};
};
