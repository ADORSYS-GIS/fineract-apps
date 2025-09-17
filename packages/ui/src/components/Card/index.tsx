import { CardProps } from "./Card.types";
import { CardView } from "./Card.view";
import { useCard } from "./useCard";

export const Card = (props: CardProps) => {
  console.log(props);

  const { handleClick, isLoading } = useCard(props);

  return <CardView {...props} onClick={handleClick} loading={isLoading} />;
};
