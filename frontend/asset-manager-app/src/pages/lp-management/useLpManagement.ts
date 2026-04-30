import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { assetApi } from "@/services/assetApi";

export const useLpManagement = () => {
	const queryClient = useQueryClient();
	const [lookupId, setLookupId] = useState("");
	const [registerForm, setRegisterForm] = useState({
		lpClientId: "",
		lpClientName: "",
	});
	const [showRegisterForm, setShowRegisterForm] = useState(false);
	const [selectedLpId, setSelectedLpId] = useState<number | null>(null);

	const lpDetailQuery = useQuery({
		queryKey: ["lp-detail", selectedLpId],
		queryFn: () => assetApi.getLp(selectedLpId!),
		select: (res) => res.data,
		enabled: selectedLpId != null,
	});

	const shortfallQuery = useQuery({
		queryKey: ["lp-shortfalls", selectedLpId],
		queryFn: () => assetApi.getLpShortfalls(selectedLpId!),
		select: (res) => res.data,
		enabled: selectedLpId != null,
	});

	const registerMutation = useMutation({
		mutationFn: (data: { lpClientId: number; lpClientName: string }) =>
			assetApi.createLp(data),
		onSuccess: (res) => {
			const lp = res.data;
			toast.success(
				`LP ${lp.clientName} (ID: ${lp.clientId}) registered successfully`,
			);
			setShowRegisterForm(false);
			setRegisterForm({ lpClientId: "", lpClientName: "" });
			setSelectedLpId(lp.clientId);
			queryClient.invalidateQueries({ queryKey: ["lp-detail", lp.clientId] });
			queryClient.invalidateQueries({
				queryKey: ["lp-shortfalls", lp.clientId],
			});
		},
		onError: (err: { response?: { data?: { message?: string } } }) => {
			const msg =
				err?.response?.data?.message ??
				"Failed to register LP. Please try again.";
			toast.error(msg);
		},
	});

	const handleLookup = () => {
		const id = Number(lookupId);
		if (!id || Number.isNaN(id)) {
			toast.error("Enter a valid LP Client ID");
			return;
		}
		setSelectedLpId(id);
	};

	const handleRegister = () => {
		const id = Number(registerForm.lpClientId);
		if (!id || Number.isNaN(id)) {
			toast.error("LP Client ID must be a number");
			return;
		}
		if (!registerForm.lpClientName.trim()) {
			toast.error("LP Client Name is required");
			return;
		}
		registerMutation.mutate({
			lpClientId: id,
			lpClientName: registerForm.lpClientName.trim(),
		});
	};

	return {
		lookupId,
		setLookupId,
		handleLookup,
		registerForm,
		setRegisterForm,
		showRegisterForm,
		setShowRegisterForm,
		handleRegister,
		isRegistering: registerMutation.isPending,
		selectedLpId,
		lpDetail: lpDetailQuery.data,
		isLoadingDetail: lpDetailQuery.isLoading,
		isDetailError: lpDetailQuery.isError,
		shortfalls: shortfallQuery.data,
		isLoadingShortfalls: shortfallQuery.isLoading,
	};
};
