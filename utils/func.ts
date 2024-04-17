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

enum FilterDay {
  Today = "Today",
  LastDay = "Last day",
}

enum FilterWeek {
  ThisWeek = "This week",
  LastWeek = "Last week",
  Last7Days = "Last 7 days",
}

enum FilterMonth {
  ThisMonth = "This month",
  LastMonth = "Last month",
  Last30Days = "Last 30 days",
}

enum FilterQuarter {
  ThisQuarter = "This quarter",
  LastQuarter = "Last quarter",
}

enum FilterYear {
  ThisYear = "This year",
  LastYear = "Last year",
  AllTime = "All time",
}

export type FilterTime =
  | FilterDay
  | FilterWeek
  | FilterMonth
  | FilterQuarter
  | FilterYear;

type MultiFilter = Record<string, any>;
type SingleFilter = Record<string, any>;
type RangeTimeFilter = Record<string, { startDate: Date; endDate: Date }>;
type StaticRangeFilter = Record<string, FilterTime>;
type RangeNumFilter = Record<string, { startValue: number; endValue: number }>;
type FilterControl = Record<string, TimeFilterType>;
export enum TimeFilterType {
  "StaticRange",
  "RangeTime",
}

const getStaticRangeFilterTime = (
  value: FilterTime
): { startDate: Date; endDate: Date } => {
  let range = {
    startDate: new Date(),
    endDate: new Date(),
  };
  if (value === FilterDay.Today) {
    return range;
  } else if (value === FilterDay.LastDay) {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    range = { startDate: yesterday, endDate: yesterday };
  } else if (value === FilterWeek.ThisWeek) {
    let today = new Date();
    let firstDay = today.getDate() - today.getDay();
    if (today.getDay() === 0) firstDay -= 7;
    firstDay += 1;
    let firstDate = new Date(today.setDate(firstDay));
    let lastDate = new Date(today.setDate(firstDate.getDate() + 6));

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterWeek.LastWeek) {
    let today = new Date();
    let firstDay = today.getDate() - today.getDay() - 7;
    if (today.getDay() === 0) firstDay -= 7;
    firstDay += 1;
    let firstDate = new Date(today.setDate(firstDay));
    let lastDate = new Date(today.setDate(firstDate.getDate() + 6));

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterWeek.Last7Days) {
    let today = new Date();
    let firstDay = today.getDate() - 6;
    let firstDate = new Date(today.setDate(firstDay));
    let lastDate = new Date();

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterMonth.ThisMonth) {
    let today = new Date();
    let firstDate = new Date(today.setDate(1));
    let lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterMonth.LastMonth) {
    let today = new Date();
    let firstDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    let lastDate = new Date(today.getFullYear(), today.getMonth(), 0);

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterMonth.Last30Days) {
    let today = new Date();
    let firstDay = today.getDate() - 29;
    let firstDate = new Date(today.setDate(firstDay));
    let lastDate = new Date();

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterYear.ThisYear) {
    let today = new Date();
    let firstDate = new Date(today.getFullYear(), 0, 1);
    let lastDate = new Date(today.getFullYear() + 1, 0, 0);

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterYear.LastYear) {
    let today = new Date();
    let firstDate = new Date(today.getFullYear() - 1, 0, 1);
    let lastDate = new Date(today.getFullYear(), 0, 0);

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterYear.AllTime) {
    // range = { startDate: minDate, endDate: maxDate };
  } else if (value === FilterQuarter.ThisQuarter) {
    let today = new Date();
    let month = today.getMonth() + 1;
    let quarterIndex = Math.floor((month - 1) / 3); // start with 0
    let firstMonth = quarterIndex * 3 + 1; // 1-indexed
    let lastMonth = firstMonth + 2;

    let firstDate = new Date(today.getFullYear(), firstMonth - 1, 1); // 0-indexed
    let lastDate = new Date(today.getFullYear(), lastMonth, 0); // 0-indexed

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterQuarter.LastQuarter) {
    let today = new Date();
    let month = today.getMonth() + 1;
    let quarterIndex = Math.floor((month - 1) / 3); // start with 0
    let firstMonth = quarterIndex * 3 - 2; // 1-indexed
    let lastMonth = firstMonth + 2;

    let firstDate = new Date(today.getFullYear(), firstMonth - 1, 1); // 0-indexed
    let lastDate = new Date(today.getFullYear(), lastMonth, 0); // 0-indexed

    range = { startDate: firstDate, endDate: lastDate };
  }
  return range;
};
const getMinMaxOfListTime = (
  list: Date[]
): { minDate: Date; maxDate: Date } => {
  let range = {
    minDate: new Date(),
    maxDate: new Date(),
  };

  list.forEach((date) => {
    if (date < range.minDate) range.minDate = new Date(date);
    if (date > range.maxDate) range.maxDate = new Date(date);
  });

  return range;
};

function handleMultipleFilter<T>(
  filter: MultiFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      if (
        filter[key as keyof typeof filter].length > 0 &&
        !filter[key as keyof typeof filter].includes(
          row[key as keyof typeof row]
        )
      )
        return false;
    }
    return true;
  });
  return filterList;
}

function handleSingleFilter<T>(
  filter: SingleFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      console.log("value", row[key as keyof typeof row]);
      if (
        filter[key as keyof typeof filter] === null ||
        filter[key as keyof typeof filter] === undefined
      )
        return true;
      if (
        filter[key as keyof typeof filter].length > 0 &&
        filter[key as keyof typeof filter] !== row[key as keyof typeof row]
      )
        return false;
    }
    return true;
  });
  return filterList;
}

function handleRangeTimeFilter<T>(
  filter: RangeTimeFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      let value = row[key as keyof typeof row];
      let range = filter[key as keyof typeof filter];
      if (value instanceof Date && range !== undefined && range !== null) {
        if (!isInRangeTime(value, range)) return false;
      } else return false;
    }
    return true;
  });
  return filterList;
}

const isInRangeTime = (
  value: Date,
  range: { startDate: Date; endDate: Date }
) => {
  range.startDate.setHours(0, 0, 0, 0);
  range.endDate.setHours(23, 59, 59, 999);

  if (isBefore(value, range.startDate) || isBefore(range.endDate, value))
    return false;
  return true;
};

const isInRangeNum = (value: number, startValue: number, endValue: number) => {
  if (startValue > endValue) {
    return false;
  } else if (startValue === endValue) {
    if (value !== startValue) return false;
  } else {
    if (value < startValue || value > endValue) {
      return false;
    }
  }
  return true;
};

function handleTimeFilter<T>(
  staticRangeFilter: StaticRangeFilter,
  rangeTimeFilter: RangeTimeFilter,
  filterControl: FilterControl,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filterControl);
    for (let key of filterKeys) {
      let value = row[key as keyof typeof row];
      if (
        filterControl[key as keyof typeof filterControl] ===
        TimeFilterType.RangeTime
      ) {
        console.log("key", key);
        console.log("row", row);
        let value = row[key as keyof typeof row];
        let range = rangeTimeFilter[key as keyof typeof rangeTimeFilter];
        console.log("value", value);
        if (value instanceof Date && range !== undefined && range !== null) {
          if (!isInRangeTime(value, range)) return false;
        } else return false;
      } else {
        let value = row[key as keyof typeof row];
        let staticRange = staticRangeFilter[
          key as keyof typeof staticRangeFilter
        ] as FilterTime;
        let range = getStaticRangeFilterTime(staticRange);
        if (staticRange === FilterYear.AllTime) continue;
        if (value instanceof Date && range !== undefined && range !== null) {
          if (!isInRangeTime(value, range)) return false;
        } else {
          console.log(value, " is date? ", value instanceof Date);
          return false;
        }
      }
    }
    return true;
  });
  return filterList;
}

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

function handleFilterCollumn<T>(
  filterInput: string,
  col: string,
  listToFilter: Array<T>,
  objectCol?: { col: string; keyOfCol: string }[]
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
    if (objectCol === undefined) return true;
    const keyOfCol = objectCol.find((object) => object.col === col)?.keyOfCol;
    if (keyOfCol) {
      const objectValue = row[col as keyof typeof row] as object;
      const value: any = objectValue[keyOfCol as keyof typeof objectValue];
      if (value === null || value === undefined) return false;
      if (typeof value === "string") {
        if (!value.toLowerCase().includes(filter)) return false;
      }
      if (typeof value === "number") {
        if (!value.toString().includes(filter)) return false;
      }
    }
    return true;
  });
  return filterList;
}

export {
  formatNumberInput,
  formatPrice,
  formatDate,
  handleMultipleFilter,
  handleSingleFilter,
  handleRangeTimeFilter,
  handleTimeFilter,
  isInRangeNum,
  getStaticRangeFilterTime,
  getMinMaxOfListTime,
  handleFilterCollumn,
};
