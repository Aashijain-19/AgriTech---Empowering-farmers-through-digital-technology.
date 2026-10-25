const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["seeds", "fertilizers", "pesticides", "equipment", "service"], required: true },
    description: String,
    price: { type: Number, required: true },
    unit: { type: String, default: "unit" },
    stock: { type: Number, default: 0 },
    image: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
