const Booking = require("../models/Booking");
const Product = require("../models/Product");

exports.create = async (req, res, next) => {
  try {
    const { productId, quantity = 1, serviceDate } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });
    product.stock -= quantity;
    await product.save();
    const booking = await Booking.create({ user: req.user._id, product: product._id, quantity, serviceDate, totalAmount: product.price * quantity });
    res.status(201).json(await booking.populate("product"));
  } catch (e) { next(e); }
};
exports.mine = async (req, res, next) => {
  try { res.json(await Booking.find({ user: req.user._id }).populate("product").sort("-createdAt")); } catch (e) { next(e); }
};
exports.cancel = async (req, res, next) => {
  try {
    const b = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!b) return res.status(404).json({ message: "Booking not found" });
    if (b.status !== "pending") return res.status(400).json({ message: "Only pending bookings can be cancelled" });
    b.status = "cancelled";
    await b.save();
    await Product.findByIdAndUpdate(b.product, { $inc: { stock: b.quantity } });
    res.json(b);
  } catch (e) { next(e); }
};
