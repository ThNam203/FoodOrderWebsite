import React, { useEffect, useState } from "react";
import ReportCard from "../report-card";
import ChartUI from "../chart-ui";
import { MoveRight, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { RevenueReport } from "@/models/Report";
import { displayNumber, getMonthLabel } from "@/utils/func";
import { LineChartConfig } from "../chart-config";

const ReportRevenue = ({ report }: { report: RevenueReport }) => {
  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    const res = LineChartConfig([
      {
        label: "Total revenue",
        data: report ? report.data.map((item) => Math.floor(item.value)) : [],
      },
    ]);
    setChartData(res);
  }, [report]);

  const findValue = (report: RevenueReport, month: number, year: number) => {
    const res = report.data.find(
      (item) => item.month === month && item.year === year
    );

    if (res) return res.value;
    return 0;
  };

  const current = new Date();
  const value = report
    ? findValue(report, current.getMonth() + 1, current.getFullYear())
    : 0;
  const prevValue = report
    ? findValue(report, current.getMonth(), current.getFullYear())
    : 0;
  let formattedOffset;
  if (prevValue !== 0)
    formattedOffset = displayNumber(
      Math.abs(((value - prevValue) / prevValue) * 100),
      "%"
    );
  else formattedOffset = displayNumber(value, "$");

  return (
    <ReportCard>
      <div className="w-full flex flex-row">
        <div className="w-full flex-1">
          <div className="w-full flex flex-col gap-4">
            <span className="text-2xl">
              Total revenue in {getMonthLabel(current.getMonth() + 1)}
            </span>
            <div className="w-fit flex flex-row gap-10">
              <div className="flex-1 text-xl text-secondaryWord">
                {displayNumber(value, "$")}
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
            <ChartUI type="line" data={chartData} />
          </div>
        </div>
      </div>
    </ReportCard>
  );
};

export default ReportRevenue;
