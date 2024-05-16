import {
  FoodReport,
  FoodReportData,
  MonthlyFoodReportData,
} from "@/models/Report";
import { CircleChartConfig } from "../chart-config";
import ChartUI from "../chart-ui";
import ReportCard from "../report-card";
import { useEffect, useState } from "react";

const ReportRevenueByFood = ({ report }: { report: FoodReportData[] }) => {
  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    const res = CircleChartConfig(
      report && report.length > 0 ? report.map((item) => item.food.name) : [],
      [
        {
          label: "Revenue",
          data:
            report && report.length > 0
              ? report.map((item) => Math.floor(item.revenue))
              : [],
        },
      ]
    );
    setChartData(res);
  }, [report]);

  return (
    <ReportCard className="flex flex-col justify-between pb-10">
      <span className="text-2xl">Top revenue by food</span>
      <ChartUI type="doughnut" data={chartData} />
    </ReportCard>
  );
};

export default ReportRevenueByFood;
