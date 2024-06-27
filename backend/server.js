import express, { json } from "express";

const PORT = process.env.PORT || 3000;
const app = express();

// START SERVER
app.listen(PORT, () => {
  console.log(`SEVER STARTED ON PORT ${PORT} 🚀`);
});

