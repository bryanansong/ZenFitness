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
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { scheduleNotificationJob } from "./notifications/notificationJob.js";

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
app.use("/messages", messageRoutes);
app.use("/workout-templates", workoutTemplateRoutes);
app.use("/workout-sessions", workoutSessionRoutes);
app.use("/user-statistics", userStatistics);
app.use("/template-statistics", templateStatistics);

// START SOCKET
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("authenticate", (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} authenticated`);
  });

  socket.on("send_message", async ({ chatId, message }) => {
    try {
      const savedMessage = await prisma.message.create({
        data: {
          content: message.content,
          senderId: message.senderId,
          chatId: chatId,
        },
      });

      const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { participants: true },
      });

      chat.participants.forEach((participant) => {
        if (participant.id !== message.senderId) {
          io.to(participant.id.toString()).emit(
            "receive_message",
            savedMessage
          );
        }
      });
    } catch (error) {
      console.error("Error saving and broadcasting message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

scheduleNotificationJob(io);

// START SERVER
server.listen(PORT, () => {
  console.log(`SEVER STARTED ON PORT ${PORT} 🚀`);
});
