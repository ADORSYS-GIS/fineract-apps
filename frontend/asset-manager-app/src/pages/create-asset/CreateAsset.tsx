import { FC } from "react";
import { CreateAssetView } from "./CreateAsset.view.tsx";
import { useCreateAsset } from "./useCreateAsset.ts";

export const CreateAsset: FC = () => {
	const createAssetProps = useCreateAsset();
	return <CreateAssetView {...createAssetProps} />;
};
