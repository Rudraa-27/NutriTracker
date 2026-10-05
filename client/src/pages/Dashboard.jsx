import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Flame,
  Beef,
  Cookie,
  Droplets,
  Loader2,
  RefreshCw
} from "lucide-react";

import Header from "../components/Header";
import DateNavigator from "../components/DateNavigator";
import ProgressCard from "../components/ProgressCard";
import FoodInput from "../components/FoodInput";
import FoodLogList from "../components/FoodLogList";
import GoalSettingsModal from "../components/GoalSettingsModal";

import {
  getLogs,
  createLogsFromFood,
  deleteLog
} from "../services/logService";

import {
  getGoals,
  updateGoals
} from "../services/goalService";

import { checkApiHealth } from "../services/healthService";

import {
  formatLocalDate,
  getRelativeDayName,
  groupLogsByDate,
  calculateStreak
} from "../utils/date";

const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fats: 65
};

const API_UNAVAILABLE_MESSAGE =
  "Unable to connect to the NutriTrack server. Please make sure the backend is running.";

const getApiErrorMessage = (error, fallback) => {
  if (!error.response) {
    return API_UNAVAILABLE_MESSAGE;
  }

  return (
    error.response.data?.message ||
    fallback
  );
};

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [goals, setGoals] =
    useState(DEFAULT_GOALS);

  const [selectedDate, setSelectedDate] =
    useState(formatLocalDate());

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAddingFood, setIsAddingFood] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [showGoalModal, setShowGoalModal] =
    useState(false);

  const [error, setError] =
    useState("");

  const [isApiUnavailable, setIsApiUnavailable] =
    useState(false);

  useEffect(() => {
    let isActive = true;

    const monitorApiHealth = async () => {
      try {
        await checkApiHealth();

        if (isActive) {
          setIsApiUnavailable(false);
          setError((currentError) =>
            currentError === API_UNAVAILABLE_MESSAGE
              ? ""
              : currentError
          );
        }
      } catch {
        if (isActive) {
          setIsApiUnavailable(true);
        }
      }
    };

    monitorApiHealth();

    const intervalId = window.setInterval(
      monitorApiHealth,
      10000
    );

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, []);

    useEffect(() => {
      let isActive = true;

      const loadDashboardData = async () => {
        try {
          const [
            logsData,
            goalsData
          ] = await Promise.all([
            getLogs(),
            getGoals()
          ]);

          if (!isActive) {
            return;
          }

          setLogs(logsData.logs || []);
          setGoals(goalsData.goals || DEFAULT_GOALS);
        } catch (error) {
          if (!isActive) {
            return;
          }

          console.error(
            "Failed to load dashboard:",
            error
          );

          setError(
            getApiErrorMessage(
              error,
              "Failed to load your nutrition data."
            )
          );
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      loadDashboardData();

      return () => {
        isActive = false;
      };
    }, []);

    const handleRetry = () => {
      setIsLoading(true);
      setError("");

      Promise.all([
        getLogs(),
        getGoals()
      ])
        .then(([logsData, goalsData]) => {
          setLogs(logsData.logs || []);
          setGoals(goalsData.goals || DEFAULT_GOALS);
          setIsApiUnavailable(false);
          setError("");
        })
        .catch((error) => {
          console.error(
            "Failed to load dashboard:",
            error
          );

          setError(
            getApiErrorMessage(
              error,
              "Failed to load your nutrition data."
            )
          );

          if (!error.response) {
            setIsApiUnavailable(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

  const logsByDate = useMemo(() => {
    return groupLogsByDate(logs);
  }, [logs]);

  const streak = useMemo(() => {
    return calculateStreak(
      logsByDate
    );
  }, [logsByDate]);

  const currentDayLogs = useMemo(
    () => logsByDate[selectedDate] || [],
    [logsByDate, selectedDate]
  );

  const dailyTotals = useMemo(() => {
    return currentDayLogs.reduce(
      (totals, log) => {
        totals.calories +=
          Number(log.calories || 0);

        totals.protein +=
          Number(log.protein || 0);

        totals.carbs +=
          Number(log.carbs || 0);

        totals.fats +=
          Number(log.fats || 0);

        return totals;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      }
    );
  }, [currentDayLogs]);

  const handleAddFood = async (
    foodText
  ) => {
    setIsAddingFood(true);
    setError("");

    try {
      const data =
        await createLogsFromFood({
          foodText,
          dateString: selectedDate
        });

      setLogs((previousLogs) => [
        ...(data.logs || []),
        ...previousLogs
      ]);
    } catch (error) {
      console.error(
        "Failed to add food:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to analyze food."
      );

      throw error;
    } finally {
      setIsAddingFood(false);
    }
  };

  const handleDeleteLog = async (
    logId
  ) => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await deleteLog(logId);

      setLogs((previousLogs) =>
        previousLogs.filter(
          (log) => log._id !== logId
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete food log:",
        error
      );

      setError(
        getApiErrorMessage(
          error,
          "Failed to delete food log."
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveGoals = async (
    newGoals
  ) => {
    setError("");

    try {
      const data =
        await updateGoals(newGoals);

      setGoals(data.goals);

      setShowGoalModal(false);
    } catch (error) {
      console.error(
        "Failed to update goals:",
        error
      );

      setError(
        getApiErrorMessage(
          error,
          "Failed to update your targets."
        )
      );
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">

        <Loader2
          size={40}
          className="animate-spin text-emerald-500"
        />

        <p className="text-sm text-gray-500">
          Loading your nutrition data...
        </p>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 text-gray-900">

      <Header
        streak={streak}
        onOpenGoals={() =>
          setShowGoalModal(true)
        }
      />

      <main className="mx-auto mt-2 max-w-xl space-y-6 p-4">

        {(isApiUnavailable || error) && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">

            <p>
              {isApiUnavailable
                ? API_UNAVAILABLE_MESSAGE
                : error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="flex shrink-0 items-center gap-1 font-semibold text-red-700 hover:text-red-800"
            >
              <RefreshCw size={15} />
              Retry
            </button>

          </div>
        )}

        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          logsByDate={logsByDate}
        />

        <section className="grid grid-cols-2 gap-4">

          <ProgressCard
            label="Calories"
            current={dailyTotals.calories}
            target={goals.calories}
            color="emerald"
            icon={Flame}
            unit="kcal"
          />

          <ProgressCard
            label="Protein"
            current={dailyTotals.protein}
            target={goals.protein}
            color="blue"
            icon={Beef}
          />

          <ProgressCard
            label="Carbs"
            current={dailyTotals.carbs}
            target={goals.carbs}
            color="amber"
            icon={Cookie}
          />

          <ProgressCard
            label="Fats"
            current={dailyTotals.fats}
            target={goals.fats}
            color="rose"
            icon={Droplets}
          />

        </section>

        <FoodInput
          onSubmit={handleAddFood}
          isSubmitting={isAddingFood}
        />

        <FoodLogList
          logs={currentDayLogs}
          dateLabel={getRelativeDayName(
            selectedDate
          )}
          onDelete={handleDeleteLog}
        />

      </main>

      {showGoalModal && (
        <GoalSettingsModal
          onClose={() =>
            setShowGoalModal(false)
          }
          currentGoals={goals}
          onSave={handleSaveGoals}
        />
      )}

    </div>
  );
};

export default Dashboard;