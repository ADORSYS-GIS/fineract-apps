import {
	CurrencyService,
	GeneralLedgerAccountService,
	type GetGLAccountsResponse,
	type GetOfficesResponse,
	type GetPaymentTypesResponse,
	type GetV1CurrenciesResponse,
	JournalEntriesService,
	OfficesService,
	PaymentTypeService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import "../../lib/api";
import { format } from "date-fns";

export interface EntryLine {
	glAccountId: string;
	amount: string;
}

export interface EntryFormData {
	officeId: string;
	transactionDate: string;
	currencyCode: string;
	paymentTypeId: string;
	referenceNumber: string;
	comments: string;
}

// Helper function to format date string from yyyy-MM-dd to dd MMMM yyyy
const formatTransactionDate = (dateString: string) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	return format(date, "dd MMMM yyyy");
};

export function useCreateEntry() {
	const today = new Date().toISOString().split("T")[0];
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState<EntryFormData>({
		officeId: "",
		transactionDate: today,
		currencyCode: "",
		paymentTypeId: "",
		referenceNumber: "",
		comments: "",
	});

	const [debits, setDebits] = useState<EntryLine[]>([
		{ glAccountId: "", amount: "" },
	]);

	const [credits, setCredits] = useState<EntryLine[]>([
		{ glAccountId: "", amount: "" },
	]);

	// Fetching data for form dropdowns
	const { data: glAccounts = [], isLoading: isLoadingGLAccounts } = useQuery<
		GetGLAccountsResponse[]
	>({
		queryKey: ["gl-accounts-manual"],
		queryFn: () =>
			GeneralLedgerAccountService.getV1Glaccounts({
				manualEntriesAllowed: true,
				usage: 1,
				disabled: false,
			}),
	});

	const { data: offices = [], isLoading: isLoadingOffices } = useQuery<
		GetOfficesResponse[]
	>({
		queryKey: ["offices"],
		queryFn: () => OfficesService.getV1Offices({}),
	});

	const { data: currencies, isLoading: isLoadingCurrencies } =
		useQuery<GetV1CurrenciesResponse>({
			queryKey: ["currencies"],
			queryFn: () => CurrencyService.getV1Currencies(),
		});

	const { data: paymentTypes = [], isLoading: isLoadingPaymentTypes } =
		useQuery<GetPaymentTypesResponse[]>({
			queryKey: ["payment-types"],
			queryFn: () => PaymentTypeService.getV1Paymenttypes(),
		});

	const totalDebits = debits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
	const totalCredits = credits.reduce(
		(sum, c) => sum + Number(c.amount || 0),
		0,
	);
	const isBalanced = totalDebits === totalCredits && totalDebits > 0;

	const createEntryMutation = useMutation({
		mutationFn: (entryData: {
			officeId: number;
			currencyCode: string;
			paymentTypeId: number;
			transactionDate: string;
			referenceNumber?: string;
			comments?: string;
			credits: Array<{ glAccountId: number; amount: number }>;
			debits: Array<{ glAccountId: number; amount: number }>;
		}) => {
			const requestBody = {
				...entryData,
				locale: "en",
				dateFormat: "dd MMMM yyyy",
			};
			return JournalEntriesService.postV1Journalentries({
				requestBody,
			});
		},
		onSuccess: () => {
			toast.success("Journal entry submitted successfully! Pending approval.", {
				duration: 6000,
			});
			queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
			queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
			setTimeout(() => navigate({ to: "/journal-entries" }), 1500);
		},
		onError: (error: Error) => {
			toast.error(`Submission failed: ${error.message}`);
		},
	});

	const handleFormChange = (field: keyof EntryFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleAddDebit = () =>
		setDebits((prev) => [...prev, { glAccountId: "", amount: "" }]);
	const handleRemoveDebit = (index: number) =>
		setDebits((prev) => prev.filter((_, i) => i !== index));
	const handleAddCredit = () =>
		setCredits((prev) => [...prev, { glAccountId: "", amount: "" }]);
	const handleRemoveCredit = (index: number) =>
		setCredits((prev) => prev.filter((_, i) => i !== index));

	const handleDebitChange = (
		index: number,
		field: keyof EntryLine,
		value: string,
	) => {
		setDebits((prev) =>
			prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
		);
	};

	const handleCreditChange = (
		index: number,
		field: keyof EntryLine,
		value: string,
	) => {
		setCredits((prev) =>
			prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isBalanced) {
			toast.error("Entry is not balanced. Debits must equal credits.");
			return;
		}

		const entryData = {
			officeId: Number(formData.officeId),
			currencyCode: formData.currencyCode,
			paymentTypeId: Number(formData.paymentTypeId),
			transactionDate: formatTransactionDate(formData.transactionDate),
			referenceNumber: formData.referenceNumber,
			comments: formData.comments,
			debits: debits.map((d) => ({
				glAccountId: Number(d.glAccountId),
				amount: Number(d.amount),
			})),
			credits: credits.map((c) => ({
				glAccountId: Number(c.glAccountId),
				amount: Number(c.amount),
			})),
		};

		createEntryMutation.mutate(entryData);
	};

	return {
		formData,
		debits,
		credits,
		isBalanced,
		glAccounts,
		offices,
		currencies: currencies?.selectedCurrencyOptions || [],
		paymentTypes,
		isLoading:
			isLoadingGLAccounts ||
			isLoadingOffices ||
			isLoadingCurrencies ||
			isLoadingPaymentTypes,
		isSubmitting: createEntryMutation.isPending,
		onFormChange: handleFormChange,
		onAddDebit: handleAddDebit,
		onRemoveDebit: handleRemoveDebit,
		onAddCredit: handleAddCredit,
		onRemoveCredit: handleRemoveCredit,
		onDebitChange: handleDebitChange,
		onCreditChange: handleCreditChange,
		onSubmit: handleSubmit,
	};
}
