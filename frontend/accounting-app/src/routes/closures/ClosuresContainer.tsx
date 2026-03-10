import { ClosuresView } from "./ClosuresView";
import { useClosures } from "./useClosures";

export function ClosuresContainer() {
	const { closures, isLoading, onCreateClosure, onDeleteClosure } =
		useClosures();

	return (
		<ClosuresView
			closures={closures}
			isLoading={isLoading}
			onCreateClosure={onCreateClosure}
			onDeleteClosure={onDeleteClosure}
		/>
	);
}
