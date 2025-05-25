const { v4: uuidv4 } = require('uuid');
const Package = require('../models/Package');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/cryptoUtil');

// Admin creates a new package
const createPackage = async (req, res, next) => {
  try {
    const { customerName, customerPhone, customerAddress, assignedAgents, customerId } = req.body;

    if (!customerName || !customerPhone || !customerAddress || !Array.isArray(assignedAgents) || !customerId) {
      return res.status(400).json({ message: 'Missing required fields or invalid agents list' });
    }

    const validAgents = await User.find({ _id: { $in: assignedAgents }, role: 'deliveryAgent' });
    if (validAgents.length !== assignedAgents.length) {
      return res.status(400).json({ message: 'One or more assigned agents are invalid' });
    }

    const customer = await User.findById(customerId);
    if (!customer || customer.role !== 'customer') {
      return res.status(400).json({ message: 'Invalid customer ID or role' });
    }

    const sensitiveData = JSON.stringify({ customerName, customerPhone, customerAddress });
    const encryptedData = encrypt(sensitiveData);

    const pkg = new Package({
      packageId: uuidv4(),
      customer: customer._id,
      encryptedData,
      assignedAgents,
      status: 'pending',
    });
    await pkg.save();

    await AuditLog.create({
      user: req.user._id,
      userName: req.user.name,
      action: 'package_created',
      packageId: pkg._id,
      details: `Package ${pkg._id} created and assigned to agents: ${assignedAgents.join(', ')}`,
    });

    res.status(201).json({
      message: 'Package created',
      packageId: pkg._id,
      encryptedPackageData: pkg.encryptedData
    });
  } catch (err) {
    next(err);
  }
};

// Admin fetch all packages
const getAllPackages = async (req, res, next) => {
  try {
    const packages = await Package.find()
      .populate('assignedAgents', 'name email')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json({ packages });
  } catch (err) {
    next(err);
  }
};

// Admin or Agent update status
const updatePackageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const pkg = await Package.findById(id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    const isAdmin = req.user.role === 'admin';
    const isAuthorizedAgent = pkg.assignedAgents.some(agentId => agentId.equals(req.user._id));

    if (!isAdmin && !isAuthorizedAgent) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    pkg.status = status;
    await pkg.save();

    res.json({ message: 'Package status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// Agent decrypts package data
const decryptPackageData = async (req, res) => {
  try {
    const { packageId } = req.body;
    if (!packageId) return res.status(400).json({ message: 'Missing package ID' });

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    const authorized = pkg.assignedAgents.some(agentId => agentId.equals(req.user._id));
    if (!authorized) {
      return res.status(403).json({ message: 'Unauthorized', encryptedData: pkg.encryptedData });
    }

    const decrypted = decrypt(pkg.encryptedData, process.env.SECRET_KEY);
    res.json({ decryptedData: JSON.parse(decrypted) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Decryption failed' });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  updatePackageStatus,
  decryptPackageData
};
