// === File: routes/packageRoutes.js ===
const express = require("express");
const QRCode = require("qrcode");
const Package = require("../models/Package");
const { encrypt, decrypt } = require("../utils/cryptoUtil");
const router = express.Router();
// Admin creates package
router.post("/create", async (req, res) => {
    try {
      const { name, phone, address } = req.body;
      const plainText = JSON.stringify({ name, phone, address });
      const encryptedData = encrypt(plainText);
      const newPackage = new Package({ encryptedData });
      await newPackage.save();
      const qr = await QRCode.toDataURL(encryptedData);
      res.json({ id: newPackage._id, qr });
    } catch (err) {
      res.status(500).json({ error: "Failed to create package." });
    }
  });
  
  // Delivery agent fetches encrypted data
  router.get("/:id", async (req, res) => {
    try {
      const pkg = await Package.findById(req.params.id);
      if (!pkg) return res.status(404).json({ error: "Package not found" });
      res.json({ encryptedData: pkg.encryptedData });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch package." });
    }
  });
  
  // Delivery agent decrypts QR data
  router.post("/decrypt", (req, res) => {
    try {
      const { encryptedData } = req.body;
      const decrypted = decrypt(encryptedData);
      res.json({ decrypted });
    } catch (err) {
      res.status(500).json({ error: "Failed to decrypt." });
    }
  });
  
  module.exports = router;
  
  