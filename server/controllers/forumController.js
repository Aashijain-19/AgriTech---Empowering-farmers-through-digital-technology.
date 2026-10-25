const Post = require("../models/Post");
exports.list = async (req, res, next) => {
  try { res.json(await Post.find().populate("user", "name").populate("replies.user", "name").sort("-createdAt")); } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try { res.status(201).json(await Post.create({ ...req.body, user: req.user._id })); } catch (e) { next(e); }
};
exports.reply = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.replies.push({ user: req.user._id, body: req.body.body });
    await post.save();
    res.status(201).json(post);
  } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (String(post.user) !== String(req.user._id) && req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (e) { next(e); }
};
