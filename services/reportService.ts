import {
  CustomerReport,
  FinanceReport,
  SaleByDayReport,
  SaleProfitByDayReport,
  TopProductsReport,
} from "@/models/Report";
import { format } from "date-fns";
import AxiosService from "./axiosService";

const dateToUrlPath = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

const getSaleProfitByDayReport = (startDate: Date, endDate: Date) => {
  return AxiosService.get<SaleProfitByDayReport>(
    `/api/reports/sales-with-profit?start=${dateToUrlPath(
      startDate
    )}&end=${dateToUrlPath(endDate)}`
  );
};

const getTopProductsReport = (startDate: Date, endDate: Date) => {
  return AxiosService.get<TopProductsReport>(
    `/api/reports/sales-product-profit?start=${dateToUrlPath(
      startDate
    )}&end=${dateToUrlPath(endDate)}`
  );
};

const getSaleByDayReport = (startDate: Date, endDate: Date) => {
  return AxiosService.get<SaleByDayReport>(
    `/api/reports/record-of-sale?start=${dateToUrlPath(
      startDate
    )}&end=${dateToUrlPath(endDate)}`
  );
};

const getCustomerReport = (startDate: Date, endDate: Date) => {
  return AxiosService.get<CustomerReport>(
    `/api/reports/sales-of-customer?start=${dateToUrlPath(
      startDate
    )}&end=${dateToUrlPath(endDate)}`
  );
};

const getFinanceReport = (startDate: Date, endDate: Date) => {
  return AxiosService.get<FinanceReport>(
    `/api/reports/financial-report?start=${dateToUrlPath(
      startDate
    )}&end=${dateToUrlPath(endDate)}`
  );
};

const ReportService = {
  getSaleProfitByDayReport,
  getTopProductsReport,
  getSaleByDayReport,
  getCustomerReport,
  getFinanceReport,
};

export default ReportService;
