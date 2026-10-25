const r = require("express").Router();
const c = require("../controllers/userController");
const { protect } = require("../middleware/auth");
r.post("/register", c.register);
r.post("/login", c.login);
r.post("/logout", (req, res) => res.json({ message: "Logged out" }));
r.get("/me", protect, c.me);
r.put("/me", protect, c.updateProfile);
module.exports = r;
