// backend/controllers/customerController.js

const Package = require("../models/Package");

async function getPackages(req, res, next) {
  try {
    const customerId = req.user._id;

    const packages = await Package.find({ customer: customerId })
      .select("packageId deliveryStatus trackingNumber createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.json({ packages });
  } catch (error) {
    console.error("Error fetching customer packages:", error);
    next(error);  // Use centralized error handler
  }
}

module.exports = {
  getPackages,
};
