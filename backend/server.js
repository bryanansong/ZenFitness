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
import notificationRoutes from  "./routes/notificationRoutes.js";
import { Server } from "socket.io";
import { createServer } from "node:http";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// General Middleware
app.use(cors());
app.use(json());

// Login/Signup routes
app.use("/auth", authRoutes);

// Token verification routes
app.use("", authenticateToken);

// Protected Routes
app.use("/notifications", notificationRoutes);
app.use("/profile", profileRoutes);
app.use("/workout-templates", workoutTemplateRoutes);
app.use("/workout-sessions", workoutSessionRoutes);
app.use("/user-statistics", userStatistics);
app.use("/template-statistics", templateStatistics);

// START SOCKET
io.on("connection", (socket) => {
  socket.on("authenticate", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} authenticated`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// START SERVER
server.listen(PORT, () => {
  console.log(`SEVER STARTED ON PORT ${PORT} 🚀`);
});
