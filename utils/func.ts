import { isBefore } from "date-fns";
import { format } from "date-fns";

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

const formatNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  // remove characters that is not number
  let rawValue = e.currentTarget.value.replace(/[^\d]/g, "");
  // remove leading 0s
  rawValue = rawValue.replace(/^0+(\d)/, "$1");
  let num = Number(rawValue);
  // Add commas for every 3 digits from the right
  const formattedValue = new Intl.NumberFormat("vi-VN", {
    style: "decimal",
  }).format(num);
  e.currentTarget.value = formattedValue;
  return num;
};

function handleFilterColumn<T>(
  filterInput: string,
  col: string,
  listToFilter: Array<T>
): Array<T> {
  if (filterInput === "") return listToFilter;
  const filter = filterInput.toLowerCase();
  const filterList = listToFilter.filter((row) => {
    const value = row[col as keyof typeof row];
    if (value === null || value === undefined) return false;
    if (typeof value === "string") {
      if (!value.toLowerCase().includes(filter)) return false;
    }
    if (typeof value === "number") {
      if (!value.toString().includes(filter)) return false;
    }
    return true;
  });
  return filterList;
}

const isValidInfomation = (info: string | null | undefined) => {
  if (info === null || info === undefined || info === "") return false;
  return true;
};

export {
  formatNumberInput,
  formatPrice,
  formatDate,
  handleFilterColumn,
  isValidInfomation,
};
