import { formatToFineractDate } from "@fineract-apps/ui";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { FC, useState } from "react";
import { useSavingsAccountStatement } from "@/hooks/useSavingsAccountStatement";
import { BankStatementFormSchema } from "./components";
import { SavingsAccountDetailsView } from "./SavingsAccountDetails.view";
import { useSavingsAccountDetails } from "./useSavingsAccountDetails";

export const SavingsAccountDetails: FC = () => {
	const { accountId } = useParams({
		from: "/savings-account-details/$accountId",
	});
	const navigate = useNavigate({
		from: "/savings-account-details/$accountId",
	});
	const { action } = useSearch({
		from: "/savings-account-details/$accountId",
	});
	const isBlockModalOpen = action === "block";

	const openBlockModal = () => {
		navigate({
			search: (prev) => ({ ...prev, action: "block" }),
		});
	};
	const closeBlockModal = () => {
		navigate({
			search: (prev) => ({ ...prev, action: undefined }),
		});
	};

	const props = useSavingsAccountDetails(Number(accountId), {
		onBlockSuccess: closeBlockModal,
	});

	const {
		mutate: generateStatement,
		receipt,
		setReceipt,
	} = useSavingsAccountStatement();
	const [outputType, setOutputType] = useState<"PDF" | "XLS" | "CSV">("PDF");

	const handleGenerateStatement = (data: BankStatementFormSchema) => {
		if (!props.account?.accountNo) {
			return;
		}
		generateStatement({
			accountNo: props.account.accountNo,
			fromDate: formatToFineractDate(data.startDate),
			toDate: formatToFineractDate(data.endDate),
			outputType,
		});
	};
	return (
		<SavingsAccountDetailsView
			{...props}
			isBlockModalOpen={isBlockModalOpen}
			openBlockModal={openBlockModal}
			closeBlockModal={closeBlockModal}
			onGenerateStatement={handleGenerateStatement}
			receipt={receipt}
			setReceipt={setReceipt}
			outputType={outputType}
			setOutputType={setOutputType}
		/>
	);
};
