import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    calories: {
      type: Number,
      required: true,
      min: 0,
      default: 2000
    },

    protein: {
      type: Number,
      required: true,
      min: 0,
      default: 150
    },

    carbs: {
      type: Number,
      required: true,
      min: 0,
      default: 200
    },

    fats: {
      type: Number,
      required: true,
      min: 0,
      default: 65
    }
  },
  {
    timestamps: true
  }
);

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;