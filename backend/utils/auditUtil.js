const AuditLog = require('../models/AuditLog');

const createAuditLog = async ({ packageId, agentId, action, detail }) => {
  const log = new AuditLog({
    package: packageId,
    agent: agentId,
    action,
    detail,
  });
  await log.save();
};

module.exports = { createAuditLog };
