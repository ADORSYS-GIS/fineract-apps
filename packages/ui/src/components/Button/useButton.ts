// /frontend/shared/src/components/ui/Button/useButton.ts
import { ButtonProps } from "./Button.types";

export const useButton = ({ onClick, disabled }: ButtonProps) => {
	const isDisabled = disabled ?? false;

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!isDisabled && onClick) {
			onClick(e);
		}
	};

	return { handleClick, isDisabled };
};
