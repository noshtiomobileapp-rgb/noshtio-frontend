type Props = {
  label: string;
  value: number;
};

export default function KpiCard({ label, value }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
