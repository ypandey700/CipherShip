// === File: routes/packageRoutes.js ===

const express = require("express");
const router = express.Router();
const Package = require("../models/Package");
const QRCode = require("qrcode");
const { encrypt, decrypt } = require("../utils/cryptoUtil");
const { authorizeRoles, authenticateUser } = require("../middleware/auth");

// Create encrypted package with QR (admin only)
router.post("/create", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  const { customerName, customerPhone, customerAddress } = req.body;
  try {
    const encryptedData = encrypt(JSON.stringify({ customerName, customerPhone, customerAddress }));
    const qrCodeDataUrl = await QRCode.toDataURL(encryptedData);
    const newPackage = new Package({ encryptedData, qrCodeDataUrl });
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (err) {
    res.status(500).json({ error: "Failed to create package" });
  }
});

// Assign a package to an agent (admin only)
router.put("/:id/assign", authenticateUser, authorizeRoles("admin"), async (req, res) => {
  const { agentId } = req.body;
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, { assignedTo: agentId }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to assign package" });
  }
});

// Update delivery status (agent only)
router.put("/:id/status", authenticateUser, authorizeRoles("agent"), async (req, res) => {
  const { status } = req.body;
  try {
    if (!["Pending", "In Transit", "Delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const pkg = await Package.findById(req.params.id);
    if (pkg.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    pkg.deliveryStatus = status;
    await pkg.save();
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Fetch package (any authorized user)
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    res.json(pkg);
  } catch (err) {
    res.status(404).json({ error: "Package not found" });
  }
});

// Decrypt (agent only)
router.post("/decrypt", authenticateUser, authorizeRoles("agent"), async (req, res) => {
  try {
    const decrypted = decrypt(req.body.encryptedData);
    res.json({ decrypted });
  } catch (err) {
    res.status(400).json({ error: "Decryption failed" });
  }
});

module.exports = router;
