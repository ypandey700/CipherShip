const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'Missing required fields' });

    if (!['admin', 'deliveryAgent', 'customer'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, role });
    await user.save();

    return res.status(201).json({
      message: 'User created',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) {
      const allowedRoles = ['admin', 'deliveryAgent', 'customer'];
      if (!allowedRoles.includes(req.query.role)) {
        return res.status(400).json({ message: 'Invalid role filter' });
      }
      filter.role = req.query.role;
    }
    const users = await User.find(filter).select('-passwordHash').lean();
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    if (role && !['admin', 'deliveryAgent', 'customer'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    // Check if email is already used by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use by another user" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash');

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ message: 'User updated', user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createUser, getUsers, updateUser, deleteUser };
