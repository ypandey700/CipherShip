// === File: models/Package.js ===
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  encryptedData: { type: String, required: true },
  qrCodeDataUrl: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliveryStatus: { type: String, enum: ["Pending", "In Transit", "Delivered"], default: "Pending" },
});

module.exports = mongoose.model("Package", packageSchema);
