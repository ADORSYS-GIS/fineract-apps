// /frontend/shared/src/components/ui/Button/index.tsx

import { ButtonProps } from "./Button.types";
import { ButtonView } from "./Button.view";
import { useButton } from "./useButton";

export const Button = (props: ButtonProps) => {
	const { handleClick, isDisabled } = useButton(props);

	return <ButtonView {...props} onClick={handleClick} disabled={isDisabled} />;
};
