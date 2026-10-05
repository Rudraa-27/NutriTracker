const COLOR_STYLES = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-500",
    progress: "bg-emerald-500"
  },

  blue: {
    icon: "bg-blue-50 text-blue-500",
    progress: "bg-blue-500"
  },

  amber: {
    icon: "bg-amber-50 text-amber-500",
    progress: "bg-amber-500"
  },

  rose: {
    icon: "bg-rose-50 text-rose-500",
    progress: "bg-rose-500"
  }
};

const ProgressCard = ({
  label,
  current,
  target,
  color,
  icon: Icon,
  unit = "g"
}) => {
  const safeTarget = Number(target) || 0;
  const safeCurrent = Number(current) || 0;

  const percentage =
    safeTarget > 0
      ? Math.min(
          100,
          Math.round((safeCurrent / safeTarget) * 100)
        )
      : 0;

  const isOver =
    label === "Calories" && safeCurrent > safeTarget;

  const styles =
    COLOR_STYLES[color] || COLOR_STYLES.emerald;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

      <div className="mb-3 flex items-start justify-between">

        <div className="flex items-center gap-2 text-gray-600">
          <div className={`rounded-lg p-2 ${styles.icon}`}>
            <Icon size={18} />
          </div>

          <span className="text-sm font-semibold">
            {label}
          </span>
        </div>

        <span className="text-xs font-medium text-gray-400">
          {percentage}%
        </span>

      </div>

      <div>
        <div className="mb-2 flex items-end gap-1">

          <span className="text-2xl font-bold text-gray-800">
            {Math.round(safeCurrent)}
          </span>

          <span className="mb-1 text-sm font-medium text-gray-400">
            / {Math.round(safeTarget)}
            {unit}
          </span>

        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`
              h-full rounded-full
              transition-all duration-700 ease-out
              ${isOver ? "bg-red-500" : styles.progress}
            `}
            style={{
              width: `${percentage}%`
            }}
          />
        </div>
      </div>

    </div>
  );
};

export default ProgressCard;