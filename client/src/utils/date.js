export const formatLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
};

export const addDays = (date, amount) => {
  const result = new Date(date);

  result.setDate(result.getDate() + amount);

  return result;
};

export const getRelativeDayName = (dateString) => {
  const today = formatLocalDate();
  const yesterday = formatLocalDate(addDays(new Date(), -1));

  if (dateString === today) {
    return "Today";
  }

  if (dateString === yesterday) {
    return "Yesterday";
  }

  return parseLocalDate(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
};

export const getRecentDays = (count = 7) => {
  return Array.from({ length: count }, (_, index) => {
    return formatLocalDate(addDays(new Date(), -index));
  }).reverse();
};

export const groupLogsByDate = (logs) => {
  return logs.reduce((groups, log) => {
    if (!groups[log.dateString]) {
      groups[log.dateString] = [];
    }

    groups[log.dateString].push(log);

    return groups;
  }, {});
};

export const calculateStreak = (logsByDate) => {
  const today = formatLocalDate();

  let currentDate = new Date();
  let streak = 0;

  while (true) {
    const dateString = formatLocalDate(currentDate);

    const dayLogs = logsByDate[dateString] || [];

    const calories = dayLogs.reduce(
      (total, log) => total + Number(log.calories || 0),
      0
    );

    if (calories > 0) {
      streak += 1;
    } else if (dateString !== today) {
      break;
    }

    currentDate = addDays(currentDate, -1);

    // Safety limit.
    if (streak > 3650) {
      break;
    }
  }

  return streak;
};