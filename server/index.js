require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/config");
const routes = require("./routes");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Agri-Tech API running" }));
app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`)));
