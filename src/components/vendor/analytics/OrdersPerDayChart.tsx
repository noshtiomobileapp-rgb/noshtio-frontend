type Item = {
  date: string;
  orders: number;
};

export default function OrdersPerDayChart({
  data,
}: {
  data: Item[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className="border rounded p-4 text-gray-500">
        No orders recorded in this period.
      </div>
    );
  }

  return (
    <div className="border rounded p-4 space-y-2">
      <h3 className="font-semibold">Orders Trend</h3>
      <ul className="space-y-1">
        {data.map((d) => (
          <li
            key={d.date}
            className="flex justify-between"
          >
            <span>{d.date}</span>
            <span>{d.orders}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
