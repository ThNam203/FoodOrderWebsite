"use client";

import {
  FilterDay,
  FilterTime,
  PageWithFilters,
  TimeFilter,
} from "@/components/filter";
import {
  DefaultPDFContent,
  FinanceReportPDFContent,
  ReportPDFDownloadButton,
  ReportPDFView,
} from "@/components/report/pdf";
import { showErrorToast } from "@/components/toast";
import { FinanceReport } from "@/models/Report";
import { useAppDispatch } from "@/redux/hooks";
import ReportService from "@/services/reportService";
import {
  TimeFilterType,
  getDateRangeFromTimeFilterCondition,
} from "@/utils/func";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FinanceReportPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [report, setReport] = useState<FinanceReport | null>(null);
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

  useEffect(() => {
    const fetchReport = async () => {
      const report = await ReportService.getFinanceReport(
        range.startDate,
        range.endDate
      );
      setReport(report.data);
    };

    fetchReport().catch((err) => showErrorToast(err));
  }, [reportDateRangeCondition, reportDateSingleCondition, reportDateControl]);

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
    />,
  ];

  const PDF = report ? (
    <FinanceReportPDFContent
      data={report}
      startDate={range.startDate}
      endDate={range.endDate}
    />
  ) : null;

  return (
    <PageWithFilters
      filters={filters}
      title="Finance Report"
      headerButtons={[<ReportPDFDownloadButton key={0} PdfContent={PDF!} />]}
    >
      <div className="flex flex-col space-y-4">
        {report ? (
          <ReportPDFView PdfContent={PDF!} classname="w-full h-[1000px]" />
        ) : null}
      </div>
    </PageWithFilters>
  );
}
