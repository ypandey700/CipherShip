const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const customerOnly = require("../middleware/customerOnly");
const { getPackages } = require("../controllers/customerController");

// Customer package listing
router.get("/packages", verifyToken, customerOnly, getPackages);

module.exports = router;
