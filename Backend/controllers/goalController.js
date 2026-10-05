import Goal from "../models/Goal.js";

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
    const { calories, protein, carbs, fats } = req.body;

    const goals = await Goal.findOneAndUpdate(
      { user: req.user.id },

      {
        calories,
        protein,
        carbs,
        fats
      },

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
    next(error);
  }
};