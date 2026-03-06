import { FC } from "react";
import { ScheduledPaymentsView } from "./ScheduledPayments.view";
import { useScheduledPayments } from "./useScheduledPayments";

export const ScheduledPayments: FC = () => {
	const props = useScheduledPayments();
	return <ScheduledPaymentsView {...props} />;
};
