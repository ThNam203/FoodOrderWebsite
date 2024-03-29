export const FoodPrice = ({
  currency = "đ",
  defaultPrice,
  secondPrice,
}: {
  currency?: string;
  defaultPrice: number | string;
  secondPrice?: number | string;
}) => {
  return (
    <span className="font-semibold">
      {currency + defaultPrice}{" "}
      {secondPrice ? " - " + currency + secondPrice : null}
    </span>
  );
};
