import { Input, useFormContext } from "@fineract-apps/ui";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { FormValues } from "./TellerAssign.types";

// Small time picker that ties into the Formik form context via useFormContext.
// Expects field names for start and end time and will render two text inputs
// with HH:mm placeholders. When disabled is true, inputs are disabled.
export const TimePicker: React.FC<{
	startName: string;
	endName: string;
	disabled?: boolean;
}> = ({ startName, endName, disabled }) => {
	const { t } = useTranslation();
	const formik = useFormContext<FormValues>();

	// Determine whether time inputs should be disabled based on form state.
	// Prefer the explicit prop if provided; otherwise derive from form values.
	const derivedIsFullDay = Boolean(formik.values?.isFullDay);
	const isDisabled =
		typeof disabled === "boolean" ? disabled : derivedIsFullDay;

	// Clear time fields when isFullDay becomes true
	useEffect(() => {
		const isFullDay = Boolean(formik.values?.isFullDay);
		if (isFullDay) {
			// Use empty string to keep inputs controlled
			formik.setFieldValue(startName, "");
			formik.setFieldValue(endName, "");
		}
	}, [formik.values?.isFullDay, formik.setFieldValue, startName, endName]);

	return (
		<>
			<Input
				name={startName}
				type="text"
				label={t("timePicker.startTime")}
				placeholder={t("timePicker.startTimePlaceholder")}
				helperText={t("timePicker.helperText")}
				disabled={isDisabled}
			/>
			<Input
				name={endName}
				type="text"
				label={t("timePicker.endTime")}
				placeholder={t("timePicker.endTimePlaceholder")}
				helperText={t("timePicker.helperText")}
				disabled={isDisabled}
			/>
		</>
	);
};
