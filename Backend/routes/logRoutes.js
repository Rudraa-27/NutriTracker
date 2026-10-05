import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getLogs,
  analyzeAndCreateLogs,
  deleteLog
} from "../controllers/logController.js";

const router = express.Router();

router.use(protect);

router.get("/", getLogs);
router.post("/ai", analyzeAndCreateLogs);
router.delete("/:id", deleteLog);

export default router;