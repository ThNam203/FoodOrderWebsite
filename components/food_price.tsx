import { displayNumber } from "@/utils/func";

export const FoodPrice = ({
  currency = "$",
  defaultPrice,
  secondPrice,
}: {
  currency?: string;
  defaultPrice: number;
  secondPrice?: number;
}) => {
  return (
    <span className="font-semibold">
      {displayNumber(defaultPrice, currency)}{" "}
      {secondPrice ? " - " + displayNumber(secondPrice, currency) : null}
    </span>
  );
};
