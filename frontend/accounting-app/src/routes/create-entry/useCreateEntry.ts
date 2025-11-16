import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
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

	const totalDebits = debits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
	const totalCredits = credits.reduce(
		(sum, c) => sum + Number(c.amount || 0),
		0,
	);
	const isBalanced = totalDebits === totalCredits && totalDebits > 0;

	const createEntryMutation = useMutation({
		mutationFn: async (entryData: unknown) => {
			// Placeholder - in production, submit to Fineract API
			// const response = await JournalEntriesService.postV1Journalentries({
			//   requestBody: entryData
			// });
			// return response;

			console.log("Creating journal entry:", entryData);
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return { id: 123, status: "pending_approval" };
		},
		onSuccess: () => {
			toast.success(
				"Journal entry submitted successfully. Awaiting approval.",
				{ duration: 5000 },
			);
			// Reset form
			setFormData({
				transactionDate: today,
				referenceNumber: "",
				comments: "",
			});
			setDebits([{ glAccountId: "", amount: "" }]);
			setCredits([{ glAccountId: "", amount: "" }]);
		},
		onError: (error) => {
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
