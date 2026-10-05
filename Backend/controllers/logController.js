import FoodLog from "../models/FoodLog.js";
import analyzeFood from "../services/geminiService.js";

export const getLogs = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const filter = {
      user: req.user.id
    };

    if (from && to) {
      filter.dateString = {
        $gte: from,
        $lte: to
      };
    }

    const logs = await FoodLog.find(filter)
      .sort({
        dateString: -1,
        createdAt: -1
      })
      .lean();

    res.json({
      logs
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeAndCreateLogs = async (req, res, next) => {
  try {
    const { foodText, dateString } = req.body;

    if (!foodText?.trim()) {
      return res.status(400).json({
        message: "Food description is required"
      });
    }

    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return res.status(400).json({
        message: "A valid date is required"
      });
    }

    const analyzedItems = await analyzeFood(foodText.trim());

    if (!Array.isArray(analyzedItems) || analyzedItems.length === 0) {
      return res.status(422).json({
        message: "No food items could be identified"
      });
    }

    const logsToCreate = analyzedItems.map((item) => ({
      user: req.user.id,
      foodName: item.foodName,
      calories: Number(item.calories) || 0,
      protein: Number(item.protein) || 0,
      carbs: Number(item.carbs) || 0,
      fats: Number(item.fats) || 0,
      originalInput: foodText.trim(),
      dateString
    }));

    const createdLogs = await FoodLog.insertMany(logsToCreate);

    res.status(201).json({
      logs: createdLogs
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLog = async (req, res, next) => {
  try {
    const log = await FoodLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!log) {
      return res.status(404).json({
        message: "Food log not found"
      });
    }

    res.json({
      message: "Food log deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};