import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import { router as workoutTemplateRoutes } from "./routes/workoutTemplatesRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(json());

app.use("/auth", authRoutes);

app.use("", authenticateToken);

// Protected Routes
app.use("/workout-templates", workoutTemplateRoutes);

// START SERVER
app.listen(PORT, () => {
  console.log(`SEVER STARTED ON PORT ${PORT} 🚀`);
});
