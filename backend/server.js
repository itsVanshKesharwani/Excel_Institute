
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ].filter(Boolean)
}));

app.use(express.json());

// Connect to MongoDB before processing API requests.
let dbConnection;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables");
  }

  if (!dbConnection) {
    dbConnection = mongoose.connect(process.env.MONGO_URI)
      .catch((err) => {
        dbConnection = null;
        throw err;
      });
  }

  await dbConnection;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(503).json({
      message: "Database connection unavailable"
    });
  }
});

// Preserve existing API routes.
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admission", require("./routes/admission"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

// Export the Express app for Vercel.
module.exports = app;
