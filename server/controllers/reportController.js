const Farm = require("../models/Farm");
const Crop = require("../models/Crop");
const Booking = require("../models/Booking");

// Farmer analytics: resource usage, crop stages, spending
exports.summary = async (req, res, next) => {
  try {
    const uid = req.user._id;
    const [farms, crops, bookings] = await Promise.all([Farm.find({ user: uid }), Crop.find({ user: uid }), Booking.find({ user: uid, status: { $ne: "cancelled" } })]);
    let water = 0, fertilizer = 0;
    farms.forEach((f) => f.activities.forEach((a) => { water += a.waterUsed || 0; fertilizer += a.fertilizerUsed || 0; }));
    const stages = {};
    crops.forEach((c) => (stages[c.stage] = (stages[c.stage] || 0) + 1));
    res.json({
      farms: farms.length,
      totalArea: farms.reduce((s, f) => s + (f.farmSize || 0), 0),
      crops: crops.length,
      expectedYield: crops.reduce((s, c) => s + (c.expectedYield || 0), 0),
      waterUsed: water,
      fertilizerUsed: fertilizer,
      spent: bookings.reduce((s, b) => s + b.totalAmount, 0),
      stages,
    });
  } catch (e) { next(e); }
};
