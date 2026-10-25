const Crop = require("../models/Crop");
const Alert = require("../models/Alert");
const cropInfo = require("../db/crops.json");

exports.list = async (req, res, next) => {
  try { res.json(await Crop.find({ user: req.user._id }).populate("farm", "farmName").sort("-createdAt")); } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try { res.status(201).json(await Crop.create({ ...req.body, user: req.user._id })); } catch (e) { next(e); }
};
exports.update = async (req, res, next) => {
  try {
    const { user, ...data } = req.body;
    const crop = await Crop.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, data, { new: true });
    crop ? res.json(crop) : res.status(404).json({ message: "Crop not found" });
  } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try { await Crop.deleteOne({ _id: req.params.id, user: req.user._id }); res.json({ message: "Crop deleted" }); } catch (e) { next(e); }
};
exports.info = (req, res) => res.json(cropInfo);
exports.alerts = async (req, res, next) => {
  try { res.json(await Alert.find().sort("-createdAt")); } catch (e) { next(e); }
};
