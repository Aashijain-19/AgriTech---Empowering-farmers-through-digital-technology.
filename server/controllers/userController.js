const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/User/User");

const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const safe = (u) => ({ _id: u._id, name: u.name, email: u.email, phone: u.phone, address: u.address, role: u.role, isVerified: u.isVerified });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, phone, address, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(user), user: safe(user) });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid email or password" });
    res.json({ token: sign(user), user: safe(user) });
  } catch (e) { next(e); }
};

exports.me = async (req, res) => res.json(safe(req.user));

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address }, { new: true });
    res.json(safe(user));
  } catch (e) { next(e); }
};
