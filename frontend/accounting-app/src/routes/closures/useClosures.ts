import { AccountingClosureService } from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import "../../lib/api";

export interface Closure {
	id: number;
	officeId: number;
	officeName: string;
	closingDate: string;
	deleted: boolean;
	createdDate?: string;
	createdByUsername?: string;
	comments?: string;
}

export function useClosures() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: closures = [], isLoading } = useQuery<Closure[]>({
		queryKey: ["accounting-closures"],
		queryFn: async () => {
			const response = await AccountingClosureService.getV1Glclosures({});

			const closureData = response as unknown as Array<{
				id: number;
				officeId: number;
				officeName: string;
				closingDate?: number[]; // Fineract date format [year, month, day]
				deleted: boolean;
				createdDate?: number[];
				createdByUsername?: string;
				comments?: string;
			}>;

			return closureData.map((closure) => {
				// Convert Fineract date array to ISO string
				const closingDate = closure.closingDate
					? new Date(
							closure.closingDate[0],
							closure.closingDate[1] - 1,
							closure.closingDate[2],
						).toISOString()
					: new Date().toISOString();

				const createdDate = closure.createdDate
					? new Date(
							closure.createdDate[0],
							closure.createdDate[1] - 1,
							closure.createdDate[2],
						).toISOString()
					: undefined;

				return {
					id: closure.id,
					officeId: closure.officeId,
					officeName: closure.officeName,
					closingDate,
					deleted: closure.deleted,
					createdDate,
					createdByUsername: closure.createdByUsername,
					comments: closure.comments,
				};
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (closureId: number) => {
			return await AccountingClosureService.deleteV1GlclosuresByGlClosureId({
				glClosureId: closureId,
			});
		},
		onSuccess: () => {
			toast.success("Accounting closure deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["accounting-closures"] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to delete closure: ${error.message}`);
		},
	});

	const handleCreateClosure = () => {
		navigate({ to: "/closures/create" });
	};

	const handleDeleteClosure = (closureId: number, closingDate: string) => {
		const confirmed = window.confirm(
			`Are you sure you want to delete the accounting closure for ${new Date(closingDate).toLocaleDateString()}?\n\nThis action cannot be undone.`,
		);

		if (confirmed) {
			deleteMutation.mutate(closureId);
		}
	};

	return {
		closures: closures.filter((c) => !c.deleted),
		isLoading,
		onCreateClosure: handleCreateClosure,
		onDeleteClosure: handleDeleteClosure,
	};
}
