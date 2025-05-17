// === File: routes/dashboardRoutes.js ===
const express = require("express");
const Package = require("../models/Package");
const { authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// Admin dashboard: all packages
router.get("/admin", authorizeRoles("admin"), async (req, res) => {
  const packages = await Package.find();
  res.json({ packages });
});

// Agent dashboard: packages assigned to agent (simplified logic)
router.get("/agent", authorizeRoles("agent"), async (req, res) => {
  const packages = await Package.find({ assignedTo: req.user.id });
  res.json({ packages });
});

// Customer dashboard: fetch and decrypt own delivery info
router.post("/customer/decrypt", authorizeRoles("customer"), async (req, res) => {
  const { encryptedData } = req.body;
  try {
    const { decrypt } = require("../utils/cryptoUtil");
    const decrypted = decrypt(encryptedData);
    res.json({ decrypted });
  } catch (err) {
    res.status(400).json({ error: "Decryption failed" });
  }
});

module.exports = router;
