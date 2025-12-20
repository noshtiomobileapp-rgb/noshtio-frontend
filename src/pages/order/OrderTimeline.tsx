import { ORDER_STEPS } from "./orderStatus";

type Props = {
  currentStatus: string;
};

export default function OrderTimeline({ currentStatus }: Props) {
  const currentIndex = ORDER_STEPS.findIndex(
    (s) => s.key === currentStatus
  );

  return (
    <div className="space-y-3">
      {ORDER_STEPS.map((step, idx) => {
        const completed = idx <= currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                completed ? "bg-green-600" : "bg-gray-300"
              }`}
            />
            <span
              className={`text-sm ${
                completed ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
