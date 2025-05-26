// backend/routes/agentRoutes.js

const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const agentOnly = require('../middleware/agentOnly');
const {
  listAssignedPackages,
  getAuditLogs
} = require('../controllers/agentController');

router.use(verifyToken, agentOnly);

// Agent-specific packages
router.get('/packages', listAssignedPackages);

// Agent viewable audit logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;
