// backend/routes/agentRoutes.js
const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const agentOnly = require('../middleware/agentOnly');
const { listAssignedPackages, getAuditLogs } = require('../controllers/agentController');

router.use(verifyToken, agentOnly);

router.get('/packages', listAssignedPackages);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
