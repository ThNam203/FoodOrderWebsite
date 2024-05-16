import React, { useEffect, useState } from "react";
import ReportCard from "../report-card";
import ChartUI from "../chart-ui";
import { MoveRight, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { CustomerByTransactionReport } from "@/models/Report";
import { displayNumber, getMonthLabel } from "@/utils/func";
import { BarChartConfig } from "../chart-config";

const ReportCustomerTransaction = ({
  report,
  className,
}: {
  report: CustomerByTransactionReport;
  className?: ClassValue;
}) => {
  const [chartData, setChartData] = useState<any>({});

  const findValue = (
    report: CustomerByTransactionReport,
    month: number,
    year: number
  ) => {
    const res = report.data.find(
      (item) => item.month === month && item.year === year
    );

    if (res) return res.value;
    return 0;
  };

  useEffect(() => {
    const res = BarChartConfig([
      {
        label: "Total customer",
        data: report ? report.data.map((item) => Math.floor(item.value)) : [],
      },
    ]);
    setChartData(res);
  }, [report]);

  const current = new Date();
  const value = report
    ? findValue(report, current.getMonth() + 1, current.getFullYear())
    : 0;
  const prevValue = report
    ? findValue(report, current.getMonth(), current.getFullYear())
    : 0;
  let formattedOffset = displayNumber(
    value - prevValue,
    value - prevValue > 1 ? " customers" : " customer"
  );

  return (
    <ReportCard className={className}>
      <div className="flex flex-row">
        <div className="flex-1">
          <div className="flex flex-col gap-4">
            <span className="text-2xl">
              Total number of transaction customers in{" "}
              {getMonthLabel(current.getMonth() + 1)}
            </span>
            <div className="w-fit flex flex-row gap-10">
              <div className="flex-1 text-xl text-secondaryWord">
                {displayNumber(value, value > 1 ? " customers" : " customer")}
              </div>
              <div
                className={cn(
                  "flex flex-row gap-2 items-end",
                  value > prevValue && "text-green-500",
                  value === prevValue && "text-secondaryWord",
                  value < prevValue && "text-red-500"
                )}
              >
                {value > prevValue && <TrendingUpIcon />}
                {value === prevValue && <MoveRight />}
                {value < prevValue && <TrendingDownIcon />}
                {value >= prevValue && "+"}
                {value < prevValue && "-"}
                {formattedOffset}
                <span className="text-secondaryWord">
                  {" "}
                  from {getMonthLabel(current.getMonth())}
                </span>
              </div>
            </div>
            <ChartUI type="bar" data={chartData} />
          </div>
        </div>
      </div>
    </ReportCard>
  );
};

export default ReportCustomerTransaction;
