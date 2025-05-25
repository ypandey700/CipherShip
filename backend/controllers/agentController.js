const Package = require('../models/Package');
const AuditLog = require('../models/AuditLog');

const listAssignedPackages = async (req, res) => {
  try {
    const packages = await Package.find({ assignedAgents: req.user.id }).sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assigned packages' });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ agent: req.user.id })
      .populate('package', 'customerDataEncrypted status')
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
