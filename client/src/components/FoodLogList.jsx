import { Cookie } from "lucide-react";

import FoodLogItem from "./FoodLogItem";

const FoodLogList = ({
  logs,
  dateLabel,
  onDelete
}) => {
  return (
    <section>
      <h3 className="mb-4 px-1 font-bold text-gray-800">
        Log for {dateLabel}
      </h3>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <Cookie
              size={28}
              className="text-gray-300"
            />
          </div>

          <p className="font-medium text-gray-500">
            No meals tracked yet.
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Tell the AI what you ate above!
          </p>

        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <FoodLogItem
              key={log._id}
              log={log}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FoodLogList;