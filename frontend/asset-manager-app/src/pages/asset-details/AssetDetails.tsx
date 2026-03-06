import { FC } from "react";
import { AssetDetailsView } from "./AssetDetails.view.tsx";
import { useAssetDetails } from "./useAssetDetails.ts";

export const AssetDetails: FC = () => {
	const assetDetailsProps = useAssetDetails();
	return <AssetDetailsView {...assetDetailsProps} />;
};
