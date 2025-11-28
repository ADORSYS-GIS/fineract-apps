import {
	GeneralLedgerAccountService,
	JournalEntriesService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCurrency } from "../../hooks/useCurrency";
import type { GLAccount } from "../gl-accounts/useGLAccounts";
import "../../lib/api";

export interface EntryLine {
	glAccountId: string;
	amount: string;
}

export interface EntryFormData {
	transactionDate: string;
	referenceNumber: string;
	comments: string;
}

export function useCreateEntry() {
	const today = new Date().toISOString().split("T")[0];
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { currencyCode } = useCurrency();

	const [formData, setFormData] = useState<EntryFormData>({
		transactionDate: today,
		referenceNumber: "",
		comments: "",
	});

	const [debits, setDebits] = useState<EntryLine[]>([
		{ glAccountId: "", amount: "" },
	]);

	const [credits, setCredits] = useState<EntryLine[]>([
		{ glAccountId: "", amount: "" },
	]);

	const { data: glAccounts = [] } = useQuery<GLAccount[]>({
		queryKey: ["gl-accounts"],
		queryFn: async () => {
			const response = await GeneralLedgerAccountService.getV1Glaccounts({
				manualEntriesAllowed: true,
				usage: 1, // DETAIL accounts
				disabled: false,
			});
			return response as unknown as GLAccount[];
		},
	});

	const totalDebits = debits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
	const totalCredits = credits.reduce(
		(sum, c) => sum + Number(c.amount || 0),
		0,
	);
	const isBalanced = totalDebits === totalCredits && totalDebits > 0;

	const createEntryMutation = useMutation({
		mutationFn: async (entryData: {
			officeId: number;
			transactionDate: string;
			referenceNumber?: string;
			comments?: string;
			currencyCode?: string;
			credits: Array<{ glAccountId: number; amount: number }>;
			debits: Array<{ glAccountId: number; amount: number }>;
		}) => {
			// Convert date to Fineract format [day, month, year]
			const dateParts = entryData.transactionDate.split("-");
			const formattedDate = `${dateParts[2]} ${dateParts[1]} ${dateParts[0]}`;

			const requestBody = {
				officeId: entryData.officeId,
				transactionDate: formattedDate,
				referenceNumber: entryData.referenceNumber,
				comments: entryData.comments,
				currencyCode: entryData.currencyCode,
				credits: entryData.credits,
				debits: entryData.debits,
				locale: "en",
				dateFormat: "dd MM yyyy",
			};

			const response = await JournalEntriesService.postV1Journalentries({
				requestBody,
			});

			return response;
		},
		onSuccess: () => {
			// Show success message with pending approval status
			toast.success(
				"Journal entry submitted successfully! Pending approval from admin.",
				{ duration: 6000 },
			);

			// Invalidate relevant queries to refresh data
			queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
			queryClient.invalidateQueries({ queryKey: ["accounting-stats"] });
			queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });

			// Reset form
			setFormData({
				transactionDate: today,
				referenceNumber: "",
				comments: "",
			});
			setDebits([{ glAccountId: "", amount: "" }]);
			setCredits([{ glAccountId: "", amount: "" }]);

			// navigate({ to: "/journal-entries" });
		},
		onError: (error: Error) => {
			toast.error(`Failed to create journal entry: ${error.message}`);
		},
	});

	const handleFormChange = (field: keyof EntryFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleAddDebit = () => {
		setDebits((prev) => [...prev, { glAccountId: "", amount: "" }]);
	};

	const handleRemoveDebit = (index: number) => {
		setDebits((prev) => prev.filter((_, i) => i !== index));
	};

	const handleAddCredit = () => {
		setCredits((prev) => [...prev, { glAccountId: "", amount: "" }]);
	};

	const handleRemoveCredit = (index: number) => {
		setCredits((prev) => prev.filter((_, i) => i !== index));
	};

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
			officeId: 1, // This would come from user context
			transactionDate: formData.transactionDate,
			referenceNumber: formData.referenceNumber,
			comments: formData.comments,
			currencyCode,
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

	const handleCancel = () => {
		navigate({ to: "/journal-entries" });
	};

	return {
		formData,
		debits,
		credits,
		glAccounts,
		isBalanced,
		isSubmitting: createEntryMutation.isPending,
		onFormChange: handleFormChange,
		onAddDebit: handleAddDebit,
		onRemoveDebit: handleRemoveDebit,
		onAddCredit: handleAddCredit,
		onRemoveCredit: handleRemoveCredit,
		onDebitChange: handleDebitChange,
		onCreditChange: handleCreditChange,
		onSubmit: handleSubmit,
		onCancel: handleCancel,
		currencyCode,
	};
}
