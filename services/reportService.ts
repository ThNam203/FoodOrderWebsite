import { ToFoodReport, ToMonthlyReport } from "@/convertor/reportConvertor";
import {
  CustomerReport,
  FinanceReport,
  SaleByDayReport,
  SaleProfitByDayReport,
  TopFoodReport,
} from "@/models/Report";
import { format } from "date-fns";
import AxiosService from "./axiosService";

const dateToUrlPath = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

const getOrderByMonth = (startDate: Date, endDate: Date) => {
  const url = `/api/reports/order-by-month?start=${dateToUrlPath(
    startDate
  )}&end=${dateToUrlPath(endDate)}`;
  return AxiosService.get<any>(url).then((res) => ToMonthlyReport(res.data));
};

const getTotalCompletedOrderByMonth = (startDate: Date, endDate: Date) => {
  const url = `/api/reports/total-completed-order-by-month?start=${dateToUrlPath(
    startDate
  )}&end=${dateToUrlPath(endDate)}`;
  return AxiosService.get<any>(url).then((res) => ToMonthlyReport(res.data));
};

const getAverageRevenueByMonth = (startDate: Date, endDate: Date) => {
  const url = `/api/reports/average-revenue-by-month?start=${dateToUrlPath(
    startDate
  )}&end=${dateToUrlPath(endDate)}`;
  return AxiosService.get<any>(url).then((res) => ToMonthlyReport(res.data));
};

const getCancelledOrderByMonth = (startDate: Date, endDate: Date) => {
  const url = `/api/reports/cancelled-order-by-month?start=${dateToUrlPath(
    startDate
  )}&end=${dateToUrlPath(endDate)}`;
  return AxiosService.get<any>(url).then((res) => ToMonthlyReport(res.data));
};

const getCancellationRateByMonth = (startDate: Date, endDate: Date) => {
  const url = `/api/reports/cancellation-rate-by-month?start=${dateToUrlPath(
    startDate
  )}&end=${dateToUrlPath(endDate)}`;
  return AxiosService.get<any>(url).then((res) => ToMonthlyReport(res.data));
};

const getRevenueByMonth = (startDate: Date, endDate: Date) => {
  const url = `/api/reports/revenue-by-month?start=${dateToUrlPath(
    startDate
  )}&end=${dateToUrlPath(endDate)}`;
  return AxiosService.get<any>(url).then((res) => ToMonthlyReport(res.data));
};

const getCustomerTransactionByMonth = (startDate: Date, endDate: Date) => {
  const url = `/api/reports/customer-transaction?start=${dateToUrlPath(
    startDate
  )}&end=${dateToUrlPath(endDate)}`;
  return AxiosService.get<any>(url).then((res) => ToMonthlyReport(res.data));
};

const getTopFoodByRevenue = (startDate: Date, endDate: Date) => {
  const url = `/api/reports/top-food-by-revenue?start=${dateToUrlPath(
    startDate
  )}&end=${dateToUrlPath(endDate)}`;
  return AxiosService.get<any>(url).then((res) => ToFoodReport(res.data));
};

const getTopFoodByOrder = (startDate: Date, endDate: Date) => {
  const url = `/api/reports/top-food-by-order?start=${dateToUrlPath(
    startDate
  )}&end=${dateToUrlPath(endDate)}`;
  return AxiosService.get<any>(url).then((res) => ToFoodReport(res.data));
};

const getSaleProfitByDayReport = (startDate: Date, endDate: Date) => {
  const url = `/api/reports/sales-with-profit?start=${dateToUrlPath(
    startDate
  )}&end=${dateToUrlPath(endDate)}`;
  console.log("url", url);
  return AxiosService.get<SaleProfitByDayReport>(url);
};

const getTopFoodReport = (startDate: Date, endDate: Date) => {
  return AxiosService.get<TopFoodReport>(
    `/api/reports/sales-with-food?start=${dateToUrlPath(
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
    `/api/reports/sales-with-customer?start=${dateToUrlPath(
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
  getTopFoodReport,
  getSaleByDayReport,
  getCustomerReport,
  getFinanceReport,
  getOrderByMonth,
  getTotalCompletedOrderByMonth,
  getAverageRevenueByMonth,
  getCancelledOrderByMonth,
  getCancellationRateByMonth,
  getRevenueByMonth,
  getCustomerTransactionByMonth,
  getTopFoodByRevenue,
  getTopFoodByOrder,
};

export default ReportService;
