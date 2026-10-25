const Farm = require("../models/Farm");

exports.list = async (req, res, next) => {
  try { res.json(await Farm.find({ user: req.user._id }).sort("-createdAt")); } catch (e) { next(e); }
};
exports.get = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, user: req.user._id });
    farm ? res.json(farm) : res.status(404).json({ message: "Farm not found" });
  } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try { res.status(201).json(await Farm.create({ ...req.body, user: req.user._id })); } catch (e) { next(e); }
};
exports.update = async (req, res, next) => {
  try {
    const { user, ...data } = req.body;
    const farm = await Farm.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, data, { new: true });
    farm ? res.json(farm) : res.status(404).json({ message: "Farm not found" });
  } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try { await Farm.deleteOne({ _id: req.params.id, user: req.user._id }); res.json({ message: "Farm deleted" }); } catch (e) { next(e); }
};
exports.addActivity = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, user: req.user._id });
    if (!farm) return res.status(404).json({ message: "Farm not found" });
    farm.activities.push(req.body);
    await farm.save();
    res.status(201).json(farm);
  } catch (e) { next(e); }
};
// Simple rule-based soil recommendations
exports.soilAdvice = async (req, res, next) => {
  try {
    const f = await Farm.findOne({ _id: req.params.id, user: req.user._id });
    if (!f) return res.status(404).json({ message: "Farm not found" });
    const tips = [];
    if (f.soilMoisture != null) tips.push(f.soilMoisture < 25 ? "Soil is dry - irrigate soon." : f.soilMoisture > 70 ? "Soil is waterlogged - improve drainage." : "Soil moisture is optimal.");
    if (f.soilPH != null) tips.push(f.soilPH < 6 ? "Soil is acidic - apply agricultural lime." : f.soilPH > 7.5 ? "Soil is alkaline - add gypsum or organic matter." : "Soil pH is in the ideal range.");
    if (f.nitrogen != null && f.nitrogen < 280) tips.push("Nitrogen is low - apply urea or compost.");
    if (f.phosphorus != null && f.phosphorus < 10) tips.push("Phosphorus is low - apply DAP / SSP.");
    if (f.potassium != null && f.potassium < 110) tips.push("Potassium is low - apply MOP.");
    if (!tips.length) tips.push("Add soil readings (moisture, pH, N-P-K) to get recommendations.");
    res.json({ tips });
  } catch (e) { next(e); }
};
