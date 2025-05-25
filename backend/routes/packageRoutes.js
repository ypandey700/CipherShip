const express = require("express");
const router = express.Router();
const {
  createPackage,
  getAllPackages,
  updatePackageStatus,
  decryptPackageData
} = require("../controllers/packageController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ===== Admin Routes =====
router.get("/", verifyToken, authorizeRoles("admin"), getAllPackages);
router.post("/", verifyToken, authorizeRoles("admin"), createPackage);
router.patch("/:id/status", verifyToken, authorizeRoles("admin"), updatePackageStatus);

// ===== Delivery Agent Routes =====
router.post("/decrypt", verifyToken, authorizeRoles("deliveryAgent"), decryptPackageData);
router.put("/:id/status", verifyToken, authorizeRoles("deliveryAgent"), updatePackageStatus);

module.exports = router;
