
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db/config");
const routes = require("./routes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Cache the database connection for reuse
let dbConnection;

app.use(async (req, res, next) => {
  try {
    if (!dbConnection) {
      dbConnection = connectDB();
    }

    await dbConnection;
    next();
  } catch (err) {
    dbConnection = null;
    console.error("Database connection error:", err.message);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// API routes
app.get("/", (req, res) => {
  res.json({ message: "Agri-Tech API running" });
});

app.use("/api", routes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

// Export the Express app for Vercel
module.exports = app;

// Start a local server during development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
