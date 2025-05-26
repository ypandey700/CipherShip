const mongoose = require('mongoose');
const { decrypt } = require('../utils/cryptoUtil');
const User = require('../models/User');
const Package = require('../models/Package');

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error('Error fetching user by ID:', err.message, err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserPackages = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    let packages;
    if (user.role === 'deliveryAgent') {
      packages = await Package.find({ assignedAgents: user._id }).lean();

      const decryptedPackages = packages.map(pkg => {
        try {
          const decrypted = decrypt(pkg.encryptedData);
          const { name, phone, address } = JSON.parse(decrypted);

          return {
            ...pkg,
            customerName: name,
            customerPhone: phone,
            customerAddress: address,
          };
        } catch (err) {
          console.error(`Failed to decrypt package ${pkg._id}:`, err.message);
          return {
            ...pkg,
            customerName: null,
            customerPhone: null,
            customerAddress: null,
            decryptError: true,
          };
        }
      });

      return res.json({ packages: decryptedPackages });

    } else if (user.role === 'customer') {
      packages = await Package.find({ customer: user._id }).lean();

      // For customers, only expose minimal package info:
      const safePackages = packages.map(pkg => ({
        _id: pkg._id,
        qrCode: pkg.qrCode,
        deliveryStatus: pkg.deliveryStatus,
      }));

      return res.json({ packages: safePackages });
    }

    return res.status(400).json({ message: 'Unsupported role for package listing' });

  } catch (err) {
    console.error('Error fetching user packages:', err.message, err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserById,
  getUserPackages,
};
