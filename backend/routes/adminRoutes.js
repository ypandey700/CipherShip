const express = require('express');
const router = express.Router();

const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/UserController');
const { createPackage, getAllPackages } = require('../controllers/packageController');
const { getOverview } = require('../controllers/OverviewController');
const { getAuditLogs } = require('../controllers/AuditController');

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// create adminOnly middleware by calling authorizeRoles with 'admin'
const adminOnly = authorizeRoles('admin');

// Apply middlewares
router.use(verifyToken, adminOnly);

// Now define routes...
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.post('/packages', createPackage);
router.get('/packages', getAllPackages);

router.get('/overview', getOverview);

router.get('/audit-logs', getAuditLogs);

module.exports = router;
