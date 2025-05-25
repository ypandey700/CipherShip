const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const User = require("../models/User");
const Package = require("../models/Package");

// GET /api/dashboard/admin/overview
router.get(
  "/admin/overview",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalAgents = await User.countDocuments({ role: "agent" });
      const totalPackages = await Package.countDocuments();
      const packagesDelivered = await Package.countDocuments({ status: "delivered" });
      const packagesPending = await Package.countDocuments({ status: "pending" });

      res.json({
        totalUsers,
        totalAgents,
        totalPackages,
        packagesDelivered,
        packagesPending,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
