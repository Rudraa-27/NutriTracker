import mongoose from "mongoose";

const foodLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    foodName: {
      type: String,
      required: true,
      trim: true
    },

    calories: {
      type: Number,
      required: true,
      min: 0
    },

    protein: {
      type: Number,
      required: true,
      min: 0
    },

    carbs: {
      type: Number,
      required: true,
      min: 0
    },

    fats: {
      type: Number,
      required: true,
      min: 0
    },

    originalInput: {
      type: String,
      required: true,
      trim: true
    },

    dateString: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true
    }
  },
  {
    timestamps: true
  }
);

foodLogSchema.index({ user: 1, dateString: 1 });

const FoodLog = mongoose.model("FoodLog", foodLogSchema);

export default FoodLog;