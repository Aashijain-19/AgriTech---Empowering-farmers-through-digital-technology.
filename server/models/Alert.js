const mongoose = require("mongoose");
const alertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    crop: String,
    severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    message: String,
    treatment: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Alert", alertSchema);
