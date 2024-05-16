"use client";
import { getAllMonthLabels } from "@/utils/func";
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

const ChartUI = ({ type, data }: { type: any; data: any }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  console.log("Chart data", data);

  useEffect(() => {
    if (chartRef.current && data) {
      const chart = new Chart(chartRef.current, {
        type: type,
        data: data,
        options: {
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
  return <canvas ref={chartRef}></canvas>;
};
Chart.register(...registerables);
export default ChartUI;
