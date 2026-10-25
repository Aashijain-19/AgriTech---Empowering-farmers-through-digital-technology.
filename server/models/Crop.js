const mongoose = require("mongoose");
const cropSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm" },
    cropName: { type: String, required: true },
    cropType: String,
    sowingTime: Date,
    harvestingTime: Date,
    stage: { type: String, enum: ["sown", "germination", "vegetative", "flowering", "fruiting", "harvested"], default: "sown" },
    health: { type: String, enum: ["good", "average", "poor"], default: "good" },
    expectedYield: Number, // quintals
    notes: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Crop", cropSchema);
