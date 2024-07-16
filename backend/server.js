import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import { router as workoutTemplateRoutes } from "./routes/workoutTemplatesRoutes.js";
import { router as workoutSessionRoutes } from "./routes/workoutSessionsRoutes.js";
import { router as userStatistics } from "./routes/userStatisticsRoutes.js";
import { router as templateStatistics } from "./routes/templateStatisticsRoutes.js";
import { router as profileRoutes } from "./routes/profileRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// General Middleware
app.use(cors());
app.use(json());

// Login/Signup routes
app.use("/auth", authRoutes);

// Token verification routes
app.use("", authenticateToken);

// Protected Routes
app.use("/profile", profileRoutes);
app.use("/workout-templates", workoutTemplateRoutes);
app.use("/workout-sessions", workoutSessionRoutes);
app.use("/user-statistics", userStatistics);
app.use("/template-statistics", templateStatistics);

// START SERVER
app.listen(PORT, () => {
  console.log(`SEVER STARTED ON PORT ${PORT} 🚀`);
});
