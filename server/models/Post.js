const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    replies: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, body: String, createdAt: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", postSchema);
