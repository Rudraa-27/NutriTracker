import { Calendar as CalendarIcon } from "lucide-react";

import {
  getRecentDays,
  getRelativeDayName,
  parseLocalDate,
  formatLocalDate
} from "../utils/date";

const DateNavigator = ({
  selectedDate,
  onDateChange,
  logsByDate
}) => {
  const recentDays = getRecentDays(7);
  const today = formatLocalDate();

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-gray-800">
          {getRelativeDayName(selectedDate)}
        </h2>

        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            max={today}
            onChange={(event) => {
              onDateChange(event.target.value);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Select date"
          />

          <CalendarIcon
            size={20}
            className="text-gray-400"
          />
        </div>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">

        {recentDays.map((dateString) => {
          const isSelected = dateString === selectedDate;
          const hasData =
            (logsByDate[dateString] || []).length > 0;

          const dateObject = parseLocalDate(dateString);

          const dayInitial = dateObject.toLocaleDateString(
            "en-US",
            {
              weekday: "narrow"
            }
          );

          const dayNumber = dateObject.getDate();

          return (
            <button
              key={dateString}
              type="button"
              onClick={() => onDateChange(dateString)}
              className={`
                flex h-16 w-12 shrink-0 flex-col
                items-center justify-center rounded-2xl
                transition-all
                ${
                  isSelected
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-transparent text-gray-500 hover:bg-gray-100"
                }
              `}
            >
              <span
                className={`text-xs font-medium ${
                  isSelected
                    ? "text-gray-300"
                    : "text-gray-400"
                }`}
              >
                {dayInitial}
              </span>

              <span className="mt-0.5 text-lg font-bold">
                {dayNumber}
              </span>

              <div
                className={`
                  mt-1 h-1 w-1 rounded-full
                  ${
                    hasData
                      ? isSelected
                        ? "bg-emerald-400"
                        : "bg-emerald-500"
                      : "opacity-0"
                  }
                `}
              />
            </button>
          );
        })}

      </div>
    </section>
  );
};

export default DateNavigator;