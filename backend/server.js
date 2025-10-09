const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const evalRoutes = require("./routes/evaluationRoutes");
const questionRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0'; // Add this line

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the CCDI Evaluation API",
    endpoints: {
      evaluations: "/api/evaluations",
      saveEvaluation: "/api/save-evaluation",
      getEvaluations: "/api/get-evaluation",
    },
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", evalRoutes);
app.use("/api", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/evaluations", assessmentRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    // Update this to use HOST variable
    app.listen(PORT, HOST, () =>
      console.log(`✅ Server running on http://${HOST}:${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));