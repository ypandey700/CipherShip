const User = require('../models/User');
const Package = require('../models/Package');

const getOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPackages = await Package.countDocuments();
    // Use consistent field: deliveryStatus
    const deliveredPackages = await Package.countDocuments({ deliveryStatus: 'delivered' });
    const pendingPackages = await Package.countDocuments({ deliveryStatus: { $in: ['pending', 'inTransit'] } });

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
