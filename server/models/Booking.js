const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1, min: 1 },
    bookingDate: { type: Date, default: Date.now },
    serviceDate: Date,
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "delivered", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Booking", bookingSchema);
