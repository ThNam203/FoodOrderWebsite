"use client";
import { RoundedIconButton } from "@/components/buttons";
import ReportCustomerTransaction from "@/components/report/big-component/report-customer-transaction";
import ReportOrder from "@/components/report/big-component/report-orders";
import ReportRevenue from "@/components/report/big-component/report-revenue";
import ReportRevenueByFood from "@/components/report/big-component/report-revenue-by-food";
import TrendingFood from "@/components/report/big-component/trending-food";
import ReportCard from "@/components/report/report-card";
import ReportCompareCard from "@/components/report/report-compare-card";
import { showErrorToast } from "@/components/toast";
import MotionWrapper from "@/components/visualEffect/motion-wrapper";
import {
  AverageRevenueEachOrderReport,
  CancellationRateReport,
  CustomerByTransactionReport,
  FoodReport,
  RevenueReport,
  TotalCancelledOrderReport,
  TotalCompletedOrderReport,
  TotalOrderReport,
} from "@/models/Report";
import ReportService from "@/services/reportService";
import {
  CircleCheckBig,
  CircleDollarSign,
  CircleOff,
  Percent,
} from "lucide-react";
import { useEffect, useState } from "react";

const ReportPage = () => {
  const [orderReport, setOrderReport] = useState<TotalOrderReport>();
  const [completedOrderReport, setCompletedOrderReport] =
    useState<TotalCompletedOrderReport>();
  const [cancelledOrderReport, setCancelledOrderReport] =
    useState<TotalCancelledOrderReport>();
  const [cancellationRateReport, setCancellationRateReport] =
    useState<CancellationRateReport>();
  const [revenueReport, setRevenueReport] = useState<RevenueReport>();
  const [customerTransactionReport, setCustomerTransactionReport] =
    useState<CustomerByTransactionReport>();
  const [foodByOrderReport, setFoodByOrderReport] = useState<FoodReport>();
  const [foodByRevenueReport, setFoodByRevenueReport] = useState<FoodReport>();
  const [averageRevenueEachOrderReport, setAverageRevenueEachOrderReport] =
    useState<AverageRevenueEachOrderReport>();

  useEffect(() => {
    const fetchData = async () => {
      const currentMonth = new Date().getMonth(); //start from 0
      await ReportService.getOrderByMonth(
        currentMonth === 0
          ? new Date(new Date().setMonth(currentMonth - 12))
          : new Date(new Date().setMonth(0)),
        new Date()
      ).then((monthlyReport) => {
        setOrderReport(monthlyReport);
      });
      await ReportService.getTotalCompletedOrderByMonth(
        new Date(new Date().setMonth(currentMonth - 1)),
        new Date()
      ).then((monthlyReport) => {
        setCompletedOrderReport(monthlyReport);
      });
      await ReportService.getCancelledOrderByMonth(
        new Date(new Date().setMonth(currentMonth - 1)),
        new Date()
      ).then((monthlyReport) => {
        setCancelledOrderReport(monthlyReport);
      });
      await ReportService.getCancellationRateByMonth(
        new Date(new Date().setMonth(currentMonth - 1)),
        new Date()
      ).then((monthlyReport) => {
        setCancellationRateReport(monthlyReport);
      });
      await ReportService.getRevenueByMonth(
        currentMonth === 0
          ? new Date(new Date().setMonth(currentMonth - 12))
          : new Date(new Date().setMonth(0)),
        new Date()
      ).then((monthlyReport) => {
        setRevenueReport(monthlyReport);
      });
      await ReportService.getCustomerTransactionByMonth(
        currentMonth === 0
          ? new Date(new Date().setMonth(currentMonth - 12))
          : new Date(new Date().setMonth(0)),
        new Date()
      ).then((monthlyReport) => {
        setCustomerTransactionReport(monthlyReport);
      });
      await ReportService.getTopFoodByOrder(
        new Date(new Date().setMonth(currentMonth - 1)),
        new Date()
      )
        .then((foodReport) => {
          setFoodByOrderReport(foodReport);
        })
        .catch((err) => showErrorToast(err));
      await ReportService.getAverageRevenueByMonth(
        new Date(new Date().setMonth(currentMonth - 1)),
        new Date()
      ).then((monthlyReport) => {
        setAverageRevenueEachOrderReport(monthlyReport);
      });
      const foodByRevenueReportPromise =
        await ReportService.getTopFoodByRevenue(
          new Date(new Date().setMonth(currentMonth - 1)),
          new Date()
        );
      setFoodByRevenueReport(foodByRevenueReportPromise);
    };
    fetchData().catch((err) => showErrorToast(err));
  }, []);

  useEffect(() => {
    console.log("Cancellation rate report", cancellationRateReport);
  }, [cancellationRateReport]);

  return (
    <div className="w-full h-screen bg-white p-10 overflow-y-scroll scrollbar-none space-y-6">
      <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
      <div className="w-full flex flex-col gap-4">
        <MotionWrapper
          hasHoverEffect={false}
          initial={{ x: 0, y: 40 }}
          animate={{ x: 0, y: 0 }}
        >
          <div className="w-full grid grid-cols-4 gap-4">
            <div className="grid 2xl:grid-rows-4 max-2xl:grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 max-2xl:col-span-4 gap-4">
              <ReportCard>
                <ReportCompareCard
                  title="Completed orders"
                  valueOffset={
                    completedOrderReport
                      ? completedOrderReport.data[1].value -
                        completedOrderReport.data[0].value
                      : 0
                  }
                  value={
                    completedOrderReport
                      ? completedOrderReport.data[1].value
                      : 0
                  }
                  unit="orders"
                  hasSpace={true}
                  className="border-0 p-0 "
                  icon={
                    <div className="flex flex-row items-center justify-center w-10 h-10 bg-green-300 rounded-full justify-self-end text-white border-2 border-white outline outline-2 outline-green-300">
                      <CircleCheckBig size={20} />
                    </div>
                  }
                />
              </ReportCard>
              <ReportCard>
                <ReportCompareCard
                  title="Average sale each order"
                  value={
                    averageRevenueEachOrderReport
                      ? averageRevenueEachOrderReport.data[1].value
                      : 0
                  }
                  valueOffset={
                    averageRevenueEachOrderReport
                      ? averageRevenueEachOrderReport.data[1].value -
                        averageRevenueEachOrderReport.data[0].value
                      : 0
                  }
                  unit="$"
                  className="border-0 p-0"
                  icon={
                    <div className="flex flex-row items-center justify-center w-10 h-10 bg-yellow-300 rounded-full justify-self-end text-white border-2 border-white outline outline-2 outline-yellow-300">
                      <CircleDollarSign size={20} />
                    </div>
                  }
                />
              </ReportCard>
              <ReportCard>
                <ReportCompareCard
                  title="Cancelled orders"
                  value={
                    cancelledOrderReport
                      ? cancelledOrderReport.data[1].value
                      : 0
                  }
                  valueOffset={
                    cancelledOrderReport
                      ? cancelledOrderReport.data[1].value -
                        cancelledOrderReport.data[0].value
                      : 0
                  }
                  unit="orders"
                  hasSpace={true}
                  className="border-0 p-0"
                  isInvertColor={true}
                  icon={
                    <div className="flex flex-row items-center justify-center w-10 h-10 bg-red-300 rounded-full justify-self-end text-white border-2 border-white outline outline-2 outline-red-300">
                      <CircleOff size={20} />
                    </div>
                  }
                />
              </ReportCard>
              <ReportCard>
                <ReportCompareCard
                  title="Cancellation rate"
                  value={
                    cancellationRateReport
                      ? cancellationRateReport.data[1].value
                      : 0
                  }
                  valueOffset={
                    cancellationRateReport
                      ? cancellationRateReport.data[1].value -
                        cancellationRateReport.data[0].value
                      : 0
                  }
                  unit="%"
                  className="border-0 p-0"
                  isInvertColor={true}
                  icon={
                    <div className="flex flex-row items-center justify-center w-10 h-10 bg-orange-300 rounded-full justify-self-end text-white border-2 border-white outline outline-2 outline-orange-300">
                      <Percent size={20} />
                    </div>
                  }
                />
              </ReportCard>
            </div>
            <div className="2xl:col-span-3 max-2xl:col-span-4 shrink-0">
              {orderReport && <ReportOrder report={orderReport} />}
            </div>
          </div>
        </MotionWrapper>
        <div className="grid grid-cols-6 xl:grid-rows-2 max-xl:grid-rows-3 max-md:grid-rows-4 gap-4">
          <div className="xl:col-span-4 max-xl:col-span-6 row-start-1 row-span-1">
            {revenueReport && <ReportRevenue report={revenueReport} />}
          </div>
          <div className="xl:col-span-2 xl:row-start-1 xl:row-span-1 max-xl:row-start-2 max-xl:col-span-3 max-md:col-span-6">
            {foodByRevenueReport && (
              <ReportRevenueByFood
                report={
                  foodByRevenueReport.data[foodByRevenueReport.data.length - 1]
                    .data
                }
              />
            )}
          </div>
          <div className="xl:col-span-2 max-xl:col-span-3 row-start-2 row-span-1 max-md:row-start-3 max-md:col-span-6">
            <TrendingFood
              data={
                foodByOrderReport &&
                foodByOrderReport.data[foodByOrderReport.data.length - 1]
                  ? foodByOrderReport.data[foodByOrderReport.data.length - 1]
                      .data
                  : []
              }
            />
          </div>

          <div className="xl:col-span-4 max-xl:col-span-6 xl:row-start-2 max-xl:row-start-3 max-md:row-start-4 row-span-1">
            {customerTransactionReport && (
              <ReportCustomerTransaction report={customerTransactionReport} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
