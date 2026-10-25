const Product = require("../models/Product");

exports.list = async (req, res, next) => {
  try {
    const q = {};
    if (req.query.category) q.category = req.query.category;
    if (req.query.search) q.name = { $regex: req.query.search, $options: "i" };
    res.json(await Product.find(q).sort("name"));
  } catch (e) { next(e); }
};
exports.get = async (req, res, next) => {
  try { const p = await Product.findById(req.params.id); p ? res.json(p) : res.status(404).json({ message: "Not found" }); } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); } catch (e) { next(e); }
};
exports.update = async (req, res, next) => {
  try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: "Product deleted" }); } catch (e) { next(e); }
};
