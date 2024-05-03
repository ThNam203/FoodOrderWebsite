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

export type TopProductsReport = {
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
