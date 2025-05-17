// === File: models/Package.js ===
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  encryptedData: { type: String, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Package", packageSchema);
