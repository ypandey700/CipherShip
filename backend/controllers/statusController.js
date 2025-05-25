const Package = require('../models/Package');
const { createAuditLog } = require('../utils/auditUtil');

const updateDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'in_transit', 'delivered', 'failed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    // Check agent authorization
    const authorized = pkg.assignedAgents.some(agentId => agentId.equals(req.user.id));
    if (!authorized) {
      return res.status(403).json({ message: 'Unauthorized to update this package' });
    }

    pkg.status = status;
    await pkg.save();

    await createAuditLog({
      packageId: pkg._id,
      agentId: req.user.id,
      action: 'status_update',
      detail: `Status updated to ${status}`,
    });

    res.json({ message: 'Status updated successfully', package: pkg });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

module.exports = { updateDeliveryStatus };
