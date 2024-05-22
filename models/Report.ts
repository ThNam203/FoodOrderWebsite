import { Food } from "./Food";

export type SaleProfitByDayReport = {
  date: string;
  revenue: number;
  costPrice: number;
  profit: number;
}[];

export type RevenueByStaffReport = {
  staffId: number;
  staffName: string;
  revenueMoney: number;
  returnMoney: number;
}[];

export type TopFoodReport = {
  productId: number;
  totalCustomer: number;
  totalQuantity: number;
  revenue: number;
  totalReturn: number;
  returnRevenue: number;
  netRevenue: number;
  profit: number;
}[];

export type SaleByDayReport = {
  date: string;
  total: number;
  originalPrice: number;
  income: number;
}[];

export type CustomerReport = {
  customerId: number | null;
  customerName: string;
  subTotal: number;
  discountValue: number;
  revenue: number;
  returnRevenue: number;
  netRevenue: number;
}[];

export type FinanceReport = {
  salesRevenue: number;
  adjustmentDiscount: number;
  adjustmentReturn: number;
  netRevenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  salaryStaff: number;
  bonusStaff: number;
  penaltyStaff: number;
  netProfit: number;
};

export type MonthlyData = {
  month: number;
  year: number;
  value: number;
};

export type MonthlyReport = {
  data: MonthlyData[];
};

export type TotalOrderReport = MonthlyReport;
export type TotalCompletedOrderReport = MonthlyReport;
export type TotalCancelledOrderReport = MonthlyReport;
export type AverageRevenueEachOrderReport = MonthlyReport;
export type CancellationRateReport = MonthlyReport;
export type RevenueReport = MonthlyReport;
export type CustomerByTransactionReport = MonthlyReport;

export type FoodReportData = {
  revenue: number;
  quantity: number;
  food: Food;
};
export type MonthlyFoodReportData = {
  month: number;
  year: number;
  data: FoodReportData[];
};

export type FoodReport = {
  data: MonthlyFoodReportData[];
};
