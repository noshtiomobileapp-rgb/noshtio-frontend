type Props = {
  totalOrders: number;
  totalRevenue: number;
  menuCount: number;
};

export default function AnalyticsKpis({
  totalOrders,
  totalRevenue,
  menuCount,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Kpi label="Total Orders" value={totalOrders} />
      <Kpi
        label="Revenue"
        value={formatCurrency(totalRevenue)}
      />
      <Kpi label="Menu Items" value={menuCount} />
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: any }) {
  return (
    <div className="border rounded p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}
