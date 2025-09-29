import { FC } from "react";
import { CreateClientView } from "./CreateClient.view";
import { useCreateClient } from "./useCreateClient";

export const CreateClient: FC = () => {
	const {
		initialValues,
		validationSchema,
		onSubmit,
		isCreatingClient,
		offices,
	} = useCreateClient();
	return (
		<CreateClientView
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
			isCreatingClient={isCreatingClient}
			offices={offices}
		/>
	);
};
