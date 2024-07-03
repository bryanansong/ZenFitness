import express, { json } from "express";
import authRoutes from "./routes/authRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(json());

app.use("/auth", authRoutes);

// START SERVER
app.listen(PORT, () => {
  console.log(`SEVER STARTED ON PORT ${PORT} 🚀`);
});
