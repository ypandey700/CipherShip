// backend/routes/customerRoutes.js

const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");  // your shared auth middleware
const customerOnly = require("../middleware/customerOnly");
const { getPackages } = require("../controllers/CustomerController");

router.get("/packages", verifyToken, customerOnly, getPackages);

module.exports = router;
