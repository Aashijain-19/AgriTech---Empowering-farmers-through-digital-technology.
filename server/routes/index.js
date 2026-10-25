const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const farm = require("../controllers/farmController");
const crop = require("../controllers/cropController");
const product = require("../controllers/productController");
const booking = require("../controllers/bookingController");
const forum = require("../controllers/forumController");
const admin = require("../controllers/adminController");
const report = require("../controllers/reportController");

router.use("/users", require("./user"));

// Farms
router.get("/farms", protect, farm.list);
router.post("/farms", protect, farm.create);
router.get("/farms/:id", protect, farm.get);
router.put("/farms/:id", protect, farm.update);
router.delete("/farms/:id", protect, farm.remove);
router.post("/farms/:id/activities", protect, farm.addActivity);
router.get("/farms/:id/soil-advice", protect, farm.soilAdvice);

// Crops
router.get("/crops/info", crop.info);
router.get("/crops/alerts", crop.alerts);
router.get("/crops", protect, crop.list);
router.post("/crops", protect, crop.create);
router.put("/crops/:id", protect, crop.update);
router.delete("/crops/:id", protect, crop.remove);

// Products (public read, admin write)
router.get("/products", product.list);
router.get("/products/:id", product.get);
router.post("/products", protect, adminOnly, product.create);
router.put("/products/:id", protect, adminOnly, product.update);
router.delete("/products/:id", protect, adminOnly, product.remove);

// Bookings / orders
router.post("/bookings", protect, booking.create);
router.get("/bookings/mine", protect, booking.mine);
router.put("/bookings/:id/cancel", protect, booking.cancel);

// Community forum
router.get("/forum", protect, forum.list);
router.post("/forum", protect, forum.create);
router.post("/forum/:id/replies", protect, forum.reply);
router.delete("/forum/:id", protect, forum.remove);

// Reports
router.get("/reports/summary", protect, report.summary);

// Admin
router.get("/admin/stats", protect, adminOnly, admin.stats);
router.get("/admin/users", protect, adminOnly, admin.users);
router.put("/admin/users/:id/verify", protect, adminOnly, admin.verifyUser);
router.delete("/admin/users/:id", protect, adminOnly, admin.deleteUser);
router.get("/admin/bookings", protect, adminOnly, admin.bookings);
router.put("/admin/bookings/:id", protect, adminOnly, admin.updateBooking);
router.post("/admin/alerts", protect, adminOnly, admin.createAlert);
router.delete("/admin/alerts/:id", protect, adminOnly, admin.deleteAlert);

module.exports = router;
