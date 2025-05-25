// controllers/OverviewController.js
const User = require('../models/User');
const Package = require('../models/Package');

const getOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPackages = await Package.countDocuments();
    const deliveredPackages = await Package.countDocuments({ status: 'delivered' });
    const pendingPackages = await Package.countDocuments({ status: { $in: ['pending', 'inTransit'] } });

    res.json({
      totalUsers,
      totalPackages,
      deliveredPackages,
      pendingPackages,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOverview };
