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
      {defaultPrice + currency}{" "}
      {secondPrice ? " - " + secondPrice + currency : null}
    </span>
  );
};
