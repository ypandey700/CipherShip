const express = require("express");
const router = express.Router();

const {
  createPackage,
  getAllPackages,
  updatePackageStatus,
  decryptPackageData,
} = require("../controllers/packageController");

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// Admin routes
router.get("/", verifyToken, authorizeRoles("admin"), getAllPackages);
router.post("/", verifyToken, authorizeRoles("admin"), createPackage);

// Combined status update route for admin and deliveryAgent
router.patch("/:id/status", verifyToken, authorizeRoles("admin", "deliveryAgent"), updatePackageStatus);

// Delivery agent routes
router.post("/decrypt", verifyToken, authorizeRoles("deliveryAgent"), decryptPackageData);

module.exports = router;
