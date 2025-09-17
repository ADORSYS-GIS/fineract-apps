import { CardProps } from "./Card.types";

export const useCard = ({ onClick, loading }: CardProps) => {
  const isLoading = loading ?? false;

  const handleClick = () => {
    if (!isLoading && onClick) {
      onClick();
    }
  };

  return { handleClick, isLoading };
};
