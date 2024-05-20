"use client";
import { getAllMonthLabels } from "@/utils/func";
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";

const ChartUI = ({
  type,
  data,
  className,
}: {
  type: any;
  data: any;
  className?: ClassValue;
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current && data) {
      const chart = new Chart(chartRef.current, {
        type: type,
        data: data,
        options: {
          maintainAspectRatio: true,
          responsive: true,
          parsing: {
            xAxisKey: "month",
            yAxisKey: "value",
          },
        },
      });
      return () => {
        chart.destroy();
      };
    }
  }, [data]);

  return <canvas id="chart" ref={chartRef} className="w-full"></canvas>;
};
Chart.register(...registerables);
export default ChartUI;
