import { LoansService, PostLoansResponse } from "@fineract-apps/fineract-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoanDetailsFormValues } from "./CreateLoanAccount.schema";
import {
	LoanDetailsTemplate,
	LoanRepaymentSchedule,
	PostLoansRequest,
} from "./CreateLoanAccount.types";

export const Route = createFileRoute("/loan/create-loan-account/$clientId")({});

export const useCreateLoanAccount = () => {
	const { clientId } = Route.useParams();
	const navigate = useNavigate();
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null,
	);
	const [repaymentSchedule, setRepaymentSchedule] =
		useState<LoanRepaymentSchedule | null>(null);

	const createLoanPayload = (
		values: LoanDetailsFormValues,
	): PostLoansRequest => ({
		clientId: Number(clientId),
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
		loanPurposeId: values.loanPurposeId,
		fundId: values.fundId,
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

	const createLoanAccountMutation = useMutation<
		PostLoansResponse,
		Error,
		PostLoansRequest
	>({
		mutationFn: (loanPayload) =>
			LoansService.postV1Loans({
				requestBody: loanPayload,
			}),
		onSuccess: () => {
			toast.success("Loan account created successfully");
			navigate({ to: "/" });
		},
		onError: (error) => {
			toast.error(`Failed to create loan account: ${error.message}`);
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
			const payload = createLoanPayload(values);
			createLoanAccountMutation.mutate(payload);
		},
	});

	const { values, setValues } = formik;

	const { data: loanTemplate, isLoading } = useQuery({
		queryKey: ["loan-template", clientId],
		queryFn: () =>
			LoansService.getV1LoansTemplate({
				clientId: Number(clientId),
				templateType: "individual",
			}),
	});

	const { data: loanDetails, isLoading: isLoadingLoanDetails } =
		useQuery<LoanDetailsTemplate>({
			queryKey: ["loan-details", clientId, selectedProductId],
			queryFn: () =>
				LoansService.getV1LoansTemplate({
					clientId: Number(clientId),
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

	const handleCalculateSchedule = () => {
		const payload = createLoanPayload(values);
		calculateLoanScheduleMutation.mutate(payload);
	};

	useEffect(() => {
		if (values.loanProductId) {
			setSelectedProductId(Number(values.loanProductId));
		}
	}, [values.loanProductId]);

	useEffect(() => {
		if (loanDetails) {
			setValues((currentValues) => ({
				...currentValues,
				principal: loanDetails.principal ?? currentValues.principal,
				loanTermFrequency:
					loanDetails.termFrequency ?? currentValues.loanTermFrequency,
				loanTermFrequencyType:
					loanDetails.termPeriodFrequencyType?.id ??
					currentValues.loanTermFrequencyType,
				numberOfRepayments:
					loanDetails.numberOfRepayments ?? currentValues.numberOfRepayments,
				repaymentEvery:
					loanDetails.repaymentEvery ?? currentValues.repaymentEvery,
				repaymentFrequencyType:
					loanDetails.repaymentFrequencyType?.id ??
					currentValues.repaymentFrequencyType,
				interestRatePerPeriod:
					loanDetails.interestRatePerPeriod ??
					currentValues.interestRatePerPeriod,
				amortizationType:
					loanDetails.amortizationType?.id ?? currentValues.amortizationType,
				interestType:
					loanDetails.interestType?.id ?? currentValues.interestType,
				interestCalculationPeriodType:
					loanDetails.interestCalculationPeriodType?.id ??
					currentValues.interestCalculationPeriodType,
				transactionProcessingStrategyCode:
					loanDetails.transactionProcessingStrategyOptions?.[0]?.code ??
					currentValues.transactionProcessingStrategyCode,
				charges: (loanDetails.charges ?? []).map((charge) => ({
					id: charge.id ?? 0,
					name: charge.name ?? "",
					amount: charge.amount ?? 0,
					chargeTimeType: charge.chargeTimeType ?? {
						code: "",
						id: 0,
						value: "",
					},
					chargeCalculationType: charge.chargeCalculationType ?? {
						code: "",
						id: 0,
						value: "",
					},
				})),
			}));
		}
	}, [loanDetails, setValues]);

	return {
		formik,
		loanTemplate,
		isLoading,
		loanDetails,
		isLoadingLoanDetails,
		repaymentSchedule,
		isCalculatingSchedule: calculateLoanScheduleMutation.isPending,
		handleCalculateSchedule,
		handleSubmit: formik.handleSubmit,
		isSubmitting: createLoanAccountMutation.isPending,
	};
};
