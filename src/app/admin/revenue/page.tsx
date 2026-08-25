import { getMonthlyRevenueReport, getAvailableMonthlyPeriods } from "@/services/revenue.service";
import AdminRevenueReportClient from "./AdminRevenueReportClient";

interface Props {
  searchParams: { year?: string; month?: string; rpm?: string };
}

export default async function AdminRevenuePage({ searchParams }: Props) {
  const year = searchParams.year ? parseInt(searchParams.year, 10) : undefined;
  const month = searchParams.month ? parseInt(searchParams.month, 10) : undefined;
  const rpm = searchParams.rpm ? parseFloat(searchParams.rpm) : 4.50;

  const report = await getMonthlyRevenueReport(year, month, rpm);
  const periods = getAvailableMonthlyPeriods();

  return <AdminRevenueReportClient report={report} periods={periods} />;
}
