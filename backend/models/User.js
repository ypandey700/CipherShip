// === File: models/User.js ===
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "agent", "customer"], required: true },
});

module.exports = mongoose.model("User", userSchema);
