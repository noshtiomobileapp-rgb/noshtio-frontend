import KpiCard from "./KpiCard";

type Props = {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    menuCount: number;
  };
};

export default function DashboardKpis({ summary }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KpiCard label="Total Orders" value={summary.totalOrders} />
      <KpiCard label="Total Revenue" value={summary.totalRevenue} />
      <KpiCard label="Menu Items" value={summary.menuCount} />
    </div>
  );
}
