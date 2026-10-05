import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getGoals,
  updateGoals
} from "../controllers/goalController.js";

const router = express.Router();

router.use(protect);

router.get("/", getGoals);
router.put("/", updateGoals);

export default router;