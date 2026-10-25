const User = require("../db/User/User");
const Farm = require("../models/Farm");
const Crop = require("../models/Crop");
const Product = require("../models/Product");
const Booking = require("../models/Booking");
const Alert = require("../models/Alert");

exports.stats = async (req, res, next) => {
  try {
    const [users, farms, crops, products, bookings, revenue, byStatus, lowStock] = await Promise.all([
      User.countDocuments({ role: "farmer" }),
      Farm.countDocuments(),
      Crop.countDocuments(),
      Product.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Product.find({ stock: { $lt: 20 } }).select("name stock"),
    ]);
    res.json({ users, farms, crops, products, bookings, revenue: revenue[0]?.total || 0, byStatus, lowStock });
  } catch (e) { next(e); }
};
exports.users = async (req, res, next) => {
  try { res.json(await User.find().select("-password").sort("-createdAt")); } catch (e) { next(e); }
};
exports.verifyUser = async (req, res, next) => {
  try { res.json(await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true }).select("-password")); } catch (e) { next(e); }
};
exports.deleteUser = async (req, res, next) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ message: "User deleted" }); } catch (e) { next(e); }
};
exports.bookings = async (req, res, next) => {
  try { res.json(await Booking.find().populate("user", "name email").populate("product", "name").sort("-createdAt")); } catch (e) { next(e); }
};
exports.updateBooking = async (req, res, next) => {
  try { res.json(await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })); } catch (e) { next(e); }
};
exports.createAlert = async (req, res, next) => {
  try { res.status(201).json(await Alert.create(req.body)); } catch (e) { next(e); }
};
exports.deleteAlert = async (req, res, next) => {
  try { await Alert.findByIdAndDelete(req.params.id); res.json({ message: "Alert deleted" }); } catch (e) { next(e); }
};
