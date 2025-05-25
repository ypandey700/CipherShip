const Package = require('../models/Package');
const AuditLog = require('../models/AuditLog');

const listAssignedPackages = async (req, res) => {
  try {
    // Use req.user._id for Mongo ObjectId consistency
    const packages = await Package.find({ assignedAgents: req.user._id }).sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assigned packages' });
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
