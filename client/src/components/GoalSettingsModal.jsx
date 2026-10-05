import { useState } from "react";
import { X } from "lucide-react";

const GOAL_FIELDS = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal"
  },
  {
    key: "protein",
    label: "Protein",
    unit: "g"
  },
  {
    key: "carbs",
    label: "Carbs",
    unit: "g"
  },
  {
    key: "fats",
    label: "Fats",
    unit: "g"
  }
];

const GoalSettingsModal = ({
  onClose,
  currentGoals,
  onSave
}) => {
  const [editGoals, setEditGoals] =
    useState(currentGoals);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (
    key,
    value
  ) => {
    setEditGoals((previous) => ({
      ...previous,
      [key]: value
    }));

    setError("");
  };

  const validate = () => {
    for (const field of GOAL_FIELDS) {
      const value = Number(
        editGoals[field.key]
      );

      if (
        !Number.isFinite(value) ||
        value <= 0
      ) {
        return `${field.label} must be greater than 0.`;
      }
    }

    return "";
  };

  const handleSave = async () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const normalizedGoals = {
      calories: Number(editGoals.calories),
      protein: Number(editGoals.protein),
      carbs: Number(editGoals.carbs),
      fats: Number(editGoals.fats)
    };

    setIsSaving(true);
    setError("");

    try {
      await onSave(normalizedGoals);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to save your targets."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-xl font-bold text-gray-800">
            Daily Targets
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">

          {GOAL_FIELDS.map((field) => (
            <div key={field.key}>

              <label
                htmlFor={`goal-${field.key}`}
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {field.label} ({field.unit})
              </label>

              <input
                id={`goal-${field.key}`}
                type="number"
                min="1"
                step="1"
                value={
                  editGoals[field.key] ?? ""
                }
                onChange={(event) => {
                  handleChange(
                    field.key,
                    event.target.value
                  );
                }}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

            </div>
          ))}

        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 w-full rounded-xl bg-gray-900 py-3.5 font-semibold text-white shadow-md transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : "Save Targets"}
        </button>

      </div>
    </div>
  );
};

export default GoalSettingsModal;