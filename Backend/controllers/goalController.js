import Goal from "../models/Goal.js";

const validateGoalValue = (value, fieldName) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(
      `${fieldName} must be greater than 0`
    );
  }

  return number;
};

export const getGoals = async (req, res, next) => {
  try {
    let goals = await Goal.findOne({
      user: req.user.id
    }).lean();

    if (!goals) {
      goals = await Goal.create({
        user: req.user.id
      });
    }

    res.json({
      goals
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoals = async (req, res, next) => {
  try {
    const {
      calories,
      protein,
      carbs,
      fats
    } = req.body;

    const updatedGoals = {
      calories: validateGoalValue(
        calories,
        "Calories"
      ),

      protein: validateGoalValue(
        protein,
        "Protein"
      ),

      carbs: validateGoalValue(
        carbs,
        "Carbs"
      ),

      fats: validateGoalValue(
        fats,
        "Fats"
      )
    };

    const goals =
      await Goal.findOneAndUpdate(
        {
          user: req.user.id
        },

        updatedGoals,

        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );

    res.json({
      goals
    });
  } catch (error) {
    if (
      error.message.includes("must be greater than 0")
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    next(error);
  }
};