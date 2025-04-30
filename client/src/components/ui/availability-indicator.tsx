import { AvailabilityIndicatorProps } from "@/types";

const AvailabilityIndicator = ({ status, location }: AvailabilityIndicatorProps) => {
  const statusMap = {
    inStock: {
      color: "bg-[#00C853]",
      label: "В наличии"
    },
    lowStock: {
      color: "bg-[#FF3D00]",
      label: "Заканчивается"
    },
    expected: {
      color: "bg-[#FF9100]",
      label: "Ожидается"
    },
    outOfStock: {
      color: "bg-[#9E9E9E]",
      label: "Нет в наличии"
    }
  };

  const { color, label } = statusMap[status];

  return (
    <span className="flex items-center text-xs">
      <span className={`w-3 h-3 rounded-full ${color} mr-1`}></span>
      <span className="font-roboto">{location}</span>
    </span>
  );
};

export default AvailabilityIndicator;
