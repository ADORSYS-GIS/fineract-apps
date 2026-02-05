import {
	ApiError,
	LoansService,
	PostLoansResponse,
	PutLoansLoanIdRequest,
	PutLoansLoanIdResponse,
} from "@fineract-apps/fineract-api";
import { useBusinessDate } from "@fineract-apps/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { FormikProps, useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { LoanDetailsFormValues } from "@/pages/loan/create-loan-account/CreateLoanAccount.schema";
import {
	LoanDataWithLinkedAccount,
	LoanDetailsTemplate,
	LoanRepaymentSchedule,
	PostLoansRequest,
} from "@/pages/loan/create-loan-account/CreateLoanAccount.types";

interface UseLoanAccountFormOptions {
	clientId?: number;
	loanId?: number;
	onClose?: () => void;
}

export type LoanAccountForm = {
	formik: FormikProps<LoanDetailsFormValues>;
	loanTemplate: LoanDetailsTemplate | undefined;
	isLoading: boolean;
	loanDetails: LoanDetailsTemplate | undefined;
	isLoadingLoanDetails: boolean;
	repaymentSchedule: LoanRepaymentSchedule | null;
	isCalculatingSchedule: boolean;
	handleCalculateSchedule: () => void;
	handleSubmit: () => void;
	isSubmitting: boolean;
};

export const useLoanAccountForm = ({
	clientId,
	loanId,
	onClose,
}: UseLoanAccountFormOptions): LoanAccountForm => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [selectedProductId, setSelectedProductId] = useState<number | null>(
		null,
	);
	const [repaymentSchedule, setRepaymentSchedule] =
		useState<LoanRepaymentSchedule | null>(null);

	const isEditMode = !!loanId;
	const { userData, isUserDataLoading } = useAuth();
	const { businessDate } = useBusinessDate();

	const { data: loanData, isLoading: isLoanDataLoading } = useQuery({
		queryKey: ["loan", loanId],
		queryFn: () =>
			LoansService.getV1LoansByLoanId({ loanId: loanId!, associations: "all" }),
		enabled: isEditMode,
	});

	const createBaseLoanPayload = (values: LoanDetailsFormValues) => ({
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
		linkAccountId: values.linkAccountId,
		loanType: "individual" as const,
		locale: "en",
		dateFormat: "dd MMMM yyyy",
		submittedOnDate: values.submittedOnDate
			? format(new Date(values.submittedOnDate), "dd MMMM yyyy")
			: undefined,
		expectedDisbursementDate: values.expectedDisbursementDate
			? format(new Date(values.expectedDisbursementDate), "dd MMMM yyyy")
			: undefined,
	});

	const createLoanPayload = (
		values: LoanDetailsFormValues,
	): PostLoansRequest => {
		const payload: PostLoansRequest = {
			...createBaseLoanPayload(values),
			clientId: Number(clientId) || loanData?.clientId,
			loanPurposeId: values.loanPurposeId,
			fundId: values.fundId,
			charges: values.charges?.map((charge) => ({
				chargeId: charge.id,
				amount: charge.amount,
			})),
		};

		// Only include loanOfficerId if it's defined
		if (values.loanOfficerId !== undefined) {
			payload.loanOfficerId = values.loanOfficerId;
		}

		return payload;
	};

	const createEditLoanPayload = (
		values: LoanDetailsFormValues,
	): PutLoansLoanIdRequest =>
		createLoanPayload(values) as unknown as PutLoansLoanIdRequest;

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
			navigate({ to: `/client-details/${clientId}` });
		},
		onError: (error) => {
			if (error instanceof ApiError) {
				const apiError = error.body as {
					errors: { defaultUserMessage: string }[];
				};
				const message =
					apiError.errors?.[0]?.defaultUserMessage ||
					"An unknown error occurred";
				toast.error(message);
			} else {
				toast.error(`Failed to create loan account: ${error.message}`);
			}
		},
	});

	const editLoanAccountMutation = useMutation<
		PutLoansLoanIdResponse,
		Error,
		PutLoansLoanIdRequest
	>({
		mutationFn: (loanPayload) =>
			LoansService.putV1LoansByLoanId({
				loanId: loanId!,
				requestBody: loanPayload,
			}),
		onSuccess: () => {
			toast.success("Loan account updated successfully");
			queryClient.invalidateQueries({
				queryKey: ["accounts", clientId],
			});
			onClose?.();
		},
		onError: (error) => {
			toast.error(`Failed to update loan account: ${error.message}`);
		},
	});

	const formik = useFormik<LoanDetailsFormValues>({
		initialValues: {
			loanProductId: 0,
			currencyCode: "",
			externalId: "",
			linkAccountId: undefined,
			loanOfficerId: undefined,
			loanPurposeId: undefined,
			fundId: undefined,
			submittedOnDate: businessDate,
			expectedDisbursementDate: businessDate,
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
			if (isEditMode) {
				const payload = createEditLoanPayload(values);
				editLoanAccountMutation.mutate(payload);
			} else {
				const payload = createLoanPayload(values);
				createLoanAccountMutation.mutate(payload);
			}
		},
	});

	const { values, setValues, setFieldValue } = formik;

	const handleSubmit = () => {
		formik.handleSubmit();
	};

	useEffect(() => {
		if (isEditMode && loanData) {
			setValues({
				loanProductId: loanData.loanProductId ?? 0,
				externalId: loanData.externalId ?? "",
				currencyCode: loanData.currency?.code ?? "",
				linkAccountId: (loanData as LoanDataWithLinkedAccount)?.linkedAccount
					?.id,
				loanPurposeId: loanData.loanPurposeId,
				loanOfficerId: loanData.loanOfficerId,
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
				interestCalculationPeriodType:
					loanData.interestCalculationPeriodType?.id,
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
	}, [isEditMode, loanData, setValues]);

	const { data: loanTemplate, isLoading } = useQuery({
		queryKey: ["loan-template", clientId ?? loanData?.clientId],
		queryFn: () =>
			LoansService.getV1LoansTemplate({
				clientId: Number(clientId ?? loanData?.clientId),
				templateType: "individual",
			}),
		enabled: !!clientId || !!loanData?.clientId,
	});

	const { data: loanDetails, isLoading: isLoadingLoanDetails } =
		useQuery<LoanDetailsTemplate>({
			queryKey: [
				"loan-details",
				clientId ?? loanData?.clientId,
				selectedProductId,
			],
			queryFn: () =>
				LoansService.getV1LoansTemplate({
					clientId: Number(clientId ?? loanData?.clientId),
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
			if (error instanceof ApiError) {
				const apiError = error.body as {
					errors: { defaultUserMessage: string }[];
				};
				const message =
					apiError.errors?.[0]?.defaultUserMessage ||
					"An unknown error occurred";
				toast.error(message);
			} else {
				toast.error(`Failed to calculate repayment schedule: ${error.message}`);
			}
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
		if (loanDetails && !isEditMode) {
			setValues((currentValues) => ({
				...currentValues,
				principal: loanDetails.principal ?? currentValues.principal,
				currencyCode: loanDetails.currency?.code ?? currentValues.currencyCode,
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
	}, [loanDetails, setValues, isEditMode]);

	useEffect(() => {
		if (
			!isEditMode &&
			userData?.staffId &&
			values.loanOfficerId !== userData.staffId
		) {
			setFieldValue("loanOfficerId", userData.staffId);
		}
	}, [isEditMode, userData, setFieldValue, values.loanOfficerId]);

	useEffect(() => {
		if (!isEditMode && businessDate) {
			setValues((currentValues) => ({
				...currentValues,
				submittedOnDate: businessDate,
				expectedDisbursementDate: businessDate,
			}));
		}
	}, [isEditMode, businessDate, setValues]);

	return {
		formik,
		loanTemplate,
		isLoading: isLoading || isLoanDataLoading || isUserDataLoading,
		loanDetails,
		isLoadingLoanDetails,
		repaymentSchedule,
		isCalculatingSchedule: calculateLoanScheduleMutation.isPending,
		handleCalculateSchedule,
		handleSubmit,
		isSubmitting:
			createLoanAccountMutation.isPending ||
			editLoanAccountMutation.isPending ||
			isUserDataLoading,
	};
};
