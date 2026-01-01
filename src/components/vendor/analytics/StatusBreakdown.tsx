type Item = {
  status: string;
  count: number;
};

export default function StatusBreakdown({ data }: { data: Item[] }) {
  return (
    <div className="border rounded p-4 space-y-2">
      <h3 className="font-semibold">Order Status</h3>
      {data.map((s) => (
        <div key={s.status} className="flex justify-between">
          <span>{s.status}</span>
          <span>{s.count}</span>
        </div>
      ))}
    </div>
  );
}
