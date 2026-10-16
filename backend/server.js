const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow requests from your Vercel frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL || "*"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/admission", require("./routes/admission"));
app.use("/api/admin", require("./routes/admin"));

// Health check route
app.get("/", (req, res) => res.json({ status: "Backend running ✅" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log("Server running on port " + PORT));
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
    process.exit(1);
  });
