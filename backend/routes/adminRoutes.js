const express = require('express');
const router = express.Router();

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const {
  createPackage,
  getAllPackages
} = require('../controllers/packageController');

const { getOverview } = require('../controllers/overviewController');
const { getAuditLogs } = require('../controllers/auditController');

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const adminOnly = authorizeRoles('admin');

// Protect all admin routes
router.use(verifyToken, adminOnly);

// User management
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Package management
router.post('/packages', createPackage);
router.get('/packages', getAllPackages);

// Dashboard stats
router.get('/overview', getOverview);

// Audit logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;
