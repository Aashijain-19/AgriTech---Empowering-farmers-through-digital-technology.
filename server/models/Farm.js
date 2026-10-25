const mongoose = require("mongoose");
const farmSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmName: { type: String, required: true },
    farmSize: { type: Number, required: true }, // acres
    location: String,
    latitude: Number,
    longitude: Number,
    soilType: String,
    soilMoisture: Number, // %
    soilPH: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    activities: [
      {
        type: { type: String, enum: ["planting", "fertilizing", "irrigation", "spraying", "harvesting", "other"] },
        note: String,
        waterUsed: Number,
        fertilizerUsed: Number,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Farm", farmSchema);
