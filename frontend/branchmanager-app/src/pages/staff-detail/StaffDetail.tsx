import { PageHeader } from "@/components/PageHeader";
import { Route } from "../../routes/staff.$staffId.index";
import { StaffDetailView } from "./StaffDetail.view";
import { useStaffDetail } from "./useStaffDetail";

export const StaffDetail = () => {
	const { staffId } = Route.useParams();
	const id = Number(staffId);
	const { data, isLoading, error } = useStaffDetail(id);
	return (
		<div>
			<PageHeader title="Staff Detail" />
			<StaffDetailView data={data} isLoading={isLoading} error={error} />
		</div>
	);
};
