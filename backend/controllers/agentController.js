const Package = require('../models/Package');
const AuditLog = require('../models/AuditLog');
const mongoose = require("mongoose");

const listAssignedPackages = async (req, res) => {
  try {
    const agentId = new mongoose.Types.ObjectId(req.user._id); // ✅ Ensure it's an ObjectId
    const packages = await Package.find({ assignedAgents: agentId }).sort({ createdAt: -1 });

    console.log("Agent ID:", agentId.toString());
    console.log("Packages found:", packages.length);

    res.json(packages);
  } catch (err) {
    console.error("Error fetching assigned packages:", err);
    res.status(500).json({ message: "Error fetching assigned packages" });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ agent: req.user._id })
      // Populate with correct Package fields: encryptedData and deliveryStatus
      .populate('package', 'encryptedData deliveryStatus')
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
};

module.exports = {
  listAssignedPackages,
  getAuditLogs,
};
