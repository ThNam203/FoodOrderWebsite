import { format } from "date-fns/format";

const formatPrice = (price: number) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);
  return formattedPrice;
};

type DateType = "date" | "datetime" | "time";
const formatDate = (date: Date, type: DateType = "date") => {
  const convertDate = new Date(date);
  if (!convertDate) return "";
  if (type === "date") return format(convertDate, "MM/dd/yyyy");
  if (type === "datetime") return format(convertDate, "MM/dd/yyyy hh:mm a");
  return format(convertDate, "hh:mm a");
};

export { formatPrice, formatDate };
