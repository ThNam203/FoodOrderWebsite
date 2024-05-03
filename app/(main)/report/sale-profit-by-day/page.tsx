"use client";

import {
  FilterDay,
  FilterTime,
  PageWithFilters,
  RangeFilter,
  TimeFilter,
} from "@/components/filter";
import {
  DefaultPDFContent,
  ReportPDFDownloadButton,
  ReportPDFView,
} from "@/components/report/pdf";
import { showErrorToast } from "@/components/toast";
import { SaleProfitByDayReport } from "@/models/Report";
import { useAppDispatch } from "@/redux/hooks";
import ReportService from "@/services/reportService";

import {
  TimeFilterType,
  getDateRangeFromTimeFilterCondition,
  handleRangeNumFilter,
  handleRangeTimeFilter,
} from "@/utils/func";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SaleReportLayout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [report, setReport] = useState<SaleProfitByDayReport | null>(null);
  const [reportDateRangeCondition, setReportDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [reportDateSingleCondition, setReportDateSingleCondition] = useState(
    FilterDay.Today as FilterTime
  );
  const [reportDateControl, setReportDateControl] = useState<TimeFilterType>(
    TimeFilterType.StaticRange
  );
  const range = getDateRangeFromTimeFilterCondition(
    reportDateControl,
    reportDateSingleCondition,
    reportDateRangeCondition
  );

  const [valueRangeConditions, setValueRangeConditions] = useState({
    revenue: {
      startValue: NaN,
      endValue: NaN,
    },
    costPrice: {
      startValue: NaN,
      endValue: NaN,
    },
    profit: {
      startValue: NaN,
      endValue: NaN,
    },
  });

  useEffect(() => {
    const fetchReport = async () => {
      const report = await ReportService.getSaleProfitByDayReport(
        range.startDate,
        range.endDate
      );

      const reportData = report.data;
      const filteredData = handleRangeNumFilter(
        valueRangeConditions,
        reportData
      );
      setReport(filteredData);
    };

    fetchReport().catch((err) => showErrorToast(err));
  }, [
    reportDateRangeCondition,
    reportDateSingleCondition,
    reportDateControl,
    valueRangeConditions,
  ]);

  const filters = [
    <TimeFilter
      key={1}
      title="Report range"
      timeFilterControl={reportDateControl}
      singleTimeValue={reportDateSingleCondition}
      rangeTimeValue={reportDateRangeCondition}
      onTimeFilterControlChanged={(value) => setReportDateControl(value)}
      onSingleTimeFilterChanged={(value) => setReportDateSingleCondition(value)}
      onRangeTimeFilterChanged={(value) => setReportDateRange(value)}
      className="mb-2"
    />,
    <RangeFilter
      key={2}
      title="Revenue"
      range={valueRangeConditions.revenue}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          revenue: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={3}
      title="Cost price"
      range={valueRangeConditions.costPrice}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          costPrice: value,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={4}
      title="Profit"
      range={valueRangeConditions.profit}
      onValuesChanged={(value) =>
        setValueRangeConditions({
          ...valueRangeConditions,
          profit: value,
        })
      }
      className="mb-2"
    />,
  ];

  const PDF = report ? (
    <DefaultPDFContent
      data={report}
      startDate={range.startDate}
      endDate={range.endDate}
      title="SALE PROFIT BY DAY REPORT"
      dataProperties={["date", "revenue", "costPrice", "profit"]}
    />
  ) : null;

  return (
    <PageWithFilters
      filters={filters}
      title="Sale Profit By Day Report"
      headerButtons={[<ReportPDFDownloadButton key={0} PdfContent={PDF!} />]}
    >
      <div className="flex flex-col space-y-4">
        {report ? (
          <ReportPDFView
            PdfContent={PDF!}
            classname="w-full h-[1000px] bg-black"
          />
        ) : null}
      </div>
    </PageWithFilters>
  );
}
