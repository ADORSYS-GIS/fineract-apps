import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
	type AgentInfo,
	getBranches,
	type ProvisionResponse,
	provisionAgentFloat,
	searchAgent,
} from "@/services/provisioningApi";

export const useAgentProvisioning = () => {
	const [phoneSearch, setPhoneSearch] = useState("");
	const [searchTrigger, setSearchTrigger] = useState("");
	const [amount, setAmount] = useState("");
	const [servicingOfficeId, setServicingOfficeId] = useState("");
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [receipt, setReceipt] = useState<ProvisionResponse | null>(null);

	const {
		data: agent,
		isLoading: isSearching,
		error: searchError,
	} = useQuery<AgentInfo>({
		queryKey: ["agentSearch", searchTrigger],
		queryFn: () => searchAgent(searchTrigger),
		enabled: searchTrigger.length > 0,
	});

	const { data: branches = [] } = useQuery({
		queryKey: ["branches"],
		queryFn: getBranches,
	});

	const mutation = useMutation({
		mutationFn: provisionAgentFloat,
		onSuccess: (data) => {
			toast.success("Provisionnement effectué avec succès");
			setReceipt(data);
			setShowConfirmation(false);
			setAmount("");
		},
		onError: (error: Error) => {
			toast.error(`Erreur: ${error.message}`);
			setShowConfirmation(false);
		},
	});

	const handleSearch = () => {
		if (phoneSearch.trim()) {
			setSearchTrigger(phoneSearch.trim());
			setReceipt(null);
		}
	};

	const handleSubmit = () => {
		if (!agent || !amount || !servicingOfficeId) return;
		const branch = branches.find(
			(b) => b.officeId === Number.parseInt(servicingOfficeId, 10),
		);
		mutation.mutate({
			agentKeycloakId: agent.keycloakId,
			agentPhone: agent.phone,
			amount: Number.parseInt(amount, 10),
			servicingOfficeId: Number.parseInt(servicingOfficeId, 10),
			servicingBranchName: branch?.name || "",
			staffId: "CURRENT_STAFF",
			staffName: "Employé Connecté",
		});
	};

	const handleConfirm = () => setShowConfirmation(true);
	const handleCancel = () => setShowConfirmation(false);
	const handleNewProvision = () => {
		setReceipt(null);
		setPhoneSearch("");
		setSearchTrigger("");
	};

	return {
		phoneSearch,
		setPhoneSearch,
		amount,
		setAmount,
		servicingOfficeId,
		setServicingOfficeId,
		agent,
		branches,
		isSearching,
		searchError,
		isSubmitting: mutation.isPending,
		showConfirmation,
		receipt,
		handleSearch,
		handleConfirm,
		handleCancel,
		handleSubmit,
		handleNewProvision,
	};
};
