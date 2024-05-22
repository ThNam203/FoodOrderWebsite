import {
  FilterDay,
  FilterMonth,
  FilterQuarter,
  FilterTime,
  FilterWeek,
  FilterYear,
} from "@/components/filter";
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

// get path for report api calls
function getDateRangeFromTimeFilterCondition<T>(
  controlCondition: TimeFilterType,
  singleDate: FilterTime,
  rangeDate: {
    startDate: Date;
    endDate: Date;
  }
): { startDate: Date; endDate: Date } {
  if (controlCondition === TimeFilterType.RangeTime) {
    return rangeDate;
  } else {
    if (singleDate === FilterYear.AllTime) {
      const startDate = new Date("2000-01-01");
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      return { startDate, endDate };
    }
    return getStaticRangeFilterTime(singleDate);
  }
}

function handleDateCondition(
  staticRangeCondition: FilterTime,
  rangeTimeCondition: {
    startDate: Date;
    endDate: Date;
  },
  filterControl: TimeFilterType,
  date: Date
): boolean {
  if (filterControl === TimeFilterType.RangeTime) {
    if (
      date &&
      rangeTimeCondition !== undefined &&
      rangeTimeCondition !== null
    ) {
      if (!isInRangeTime(date, rangeTimeCondition)) return false;
    } else return false;
  } else {
    if (staticRangeCondition === FilterYear.AllTime) return true;
    let range = getStaticRangeFilterTime(staticRangeCondition);
    if (range !== undefined && range !== null) {
      if (!isInRangeTime(date, range)) return false;
    } else {
      return false;
    }
  }
  return true;
}

type FilterCondition = {
  [key: string]: any[] | any;
};

function handleChoiceFilters<T>(
  filter: FilterCondition,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);

    for (let key of filterKeys) {
      const filterValue = filter[key];

      if (Array.isArray(filterValue)) {
        // Use handleMultipleFilter for array values
        if (
          filterValue.length > 0 &&
          !filterValue.includes(row[key as keyof typeof row])
        ) {
          return false;
        }
      } else {
        // Use handleSingleFilter for non-array values
        if (
          filterValue !== null &&
          filterValue !== undefined &&
          filterValue !== row[key as keyof typeof row]
        ) {
          return false;
        }
      }
    }

    return true;
  });

  return filterList;
}

function handleStaticRangeFilter<T>(
  filter: StaticRangeFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      let value = row[key as keyof typeof row] as Date;
      let staticRange = filter[key as keyof typeof filter] as FilterTime;
      if (staticRange === FilterYear.AllTime) continue;
      let range = getStaticRangeFilterTime(staticRange);
      if (value instanceof Date && range !== undefined && range !== null) {
        if (!isInRangeTime(value, range)) return false;
      } else return false;
    }
    return true;
  });
  return filterList;
}

function handleRangeNumFilter<T>(
  filter: RangeNumFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      let value = row[key as keyof typeof row];
      console.log("key", key, "value", value);
      if (typeof value === "number") {
        const ivalue = value as number;
        let startValue = filter[key as keyof typeof filter]
          .startValue as number;
        let endValue = filter[key as keyof typeof filter].endValue as number;
        if (isNaN(startValue)) startValue = Number.NEGATIVE_INFINITY;
        if (isNaN(endValue)) endValue = Number.POSITIVE_INFINITY;
        if (!isInRangeNum(ivalue, startValue, endValue)) return false;
      } else {
        return false;
      }
    }
    return true;
  });
  return filterList;
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

function camelToPascalWithSpaces(camelCaseStr: string) {
  // Check if the string is not empty
  if (!camelCaseStr) {
    return camelCaseStr;
  }

  // Add a space before each capital letter
  const pascalCaseWithSpaces = camelCaseStr.replace(/([A-Z])/g, " $1");

  // Capitalize the first letter and remove leading space
  const pascalCaseStr =
    pascalCaseWithSpaces.charAt(0).toUpperCase() +
    pascalCaseWithSpaces.slice(1).trim();

  return pascalCaseStr;
}

const getAllMonthLabels = (fromMonth: number = 1, toMonth: number = 12) => {
  const monthLabels: string[] = [];
  Array.from({ length: toMonth - fromMonth + 1 }, (_, i) => {
    monthLabels.push(format(new Date(0, i + fromMonth - 1), "MMM"));
  });
  return monthLabels;
};

const getMonthLabel = (month: number) => {
  return format(new Date(0, month - 1), "MMMM");
};

const getColorList = () => {
  //return some main colors that easy to see
  return [
    "#fcd34d",
    "#fca5a5",
    "#fdba74",
    "#bef264",
    "#86efac",
    "#67e8f9",
    "#5eead4",
    "#c4b5fd",
    "#a5b4fc",
    "#fda4af",
    "#f0abfc",
  ];
};

const getDateFromMonth = (month: number, year: number) => {
  return new Date(year, month - 1, 1);
};

const mapRange = (
  inputLower: number,
  inputUpper: number,
  outputLower: number,
  outputUpper: number
) => {
  const INPUT_RANGE = inputUpper - inputLower;
  const OUTPUT_RANGE = outputUpper - outputLower;

  return (value: number) =>
    outputLower + ((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0;
};

const displayNumber = (number: number, unit: "%" | string) => {
  if (unit === "%")
    if (number < 1000)
      return (
        number.toLocaleString("vi-VN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + unit
      );
  return (
    number.toLocaleString("vi-VN", {
      maximumFractionDigits: 0,
    }) + unit
  );
  return (
    number.toLocaleString("vi-VN", {
      maximumFractionDigits: 0,
    }) + unit
  );
};

export {
  formatNumberInput,
  formatPrice,
  formatDate,
  handleFilterColumn,
  isValidInfomation,
  handleMultipleFilter,
  handleSingleFilter,
  handleRangeTimeFilter,
  isInRangeTime,
  isInRangeNum,
  handleTimeFilter,
  getDateRangeFromTimeFilterCondition,
  handleDateCondition,
  handleChoiceFilters,
  handleStaticRangeFilter,
  handleRangeNumFilter,
  getStaticRangeFilterTime,
  getMinMaxOfListTime,
  camelToPascalWithSpaces,
  getAllMonthLabels,
  getMonthLabel,
  getColorList,
  mapRange,
  displayNumber,
};
