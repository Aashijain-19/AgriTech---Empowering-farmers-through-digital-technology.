const jwt = require("jsonwebtoken");
const User = require("../db/User/User");

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.adminOnly = (req, res, next) =>
  req.user?.role === "admin" ? next() : res.status(403).json({ message: "Admin access only" });
