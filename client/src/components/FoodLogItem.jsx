import { Trash2 } from "lucide-react";

const FoodLogItem = ({
  log,
  onDelete
}) => {
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${log.foodName}" from your food log?`
    );

    if (!confirmed) {
      return;
    }

    onDelete(log._id);
  };

  return (
    <div className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

      <div className="min-w-0">
        <h4 className="truncate font-bold capitalize text-gray-800">
          {log.foodName}
        </h4>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">

          <span className="font-medium text-emerald-600">
            {Math.round(log.calories)} kcal
          </span>

          <span className="text-gray-300">
            •
          </span>

          <span>
            {Math.round(log.protein)}g P
          </span>

          <span>
            {Math.round(log.carbs)}g C
          </span>

          <span>
            {Math.round(log.fats)}g F
          </span>

        </div>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        className="ml-3 shrink-0 rounded-xl p-2 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
        title="Delete item"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
};

export default FoodLogItem;