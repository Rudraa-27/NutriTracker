import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

import {
  notFound,
  errorHandler
} from "./middleware/errorMiddleware.js";

const app = express();

const PORT = process.env.PORT || 5231;

connectDB();

const isLocalDevelopmentOrigin = (origin) => {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  try {
    const { hostname, protocol } = new URL(origin);

    return protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === process.env.CLIENT_URL ||
        isLocalDevelopmentOrigin(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to NutriTrack API"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "NutriTrack API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/goals", goalRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});