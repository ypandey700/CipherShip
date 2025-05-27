import React, { memo } from 'react';
import { motion } from 'framer-motion';

const OverviewStats = ({ overview }) => {
  if (overview === null) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-400 py-6"
      >
        No statistics available
      </motion.p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-800 rounded-xl shadow-2xl"
    >
      <StatCard label="Users" value={overview.totalUsers || 0} />
      <StatCard label="Packages" value={overview.totalPackages || 0} />
      <StatCard label="Delivered" value={overview.deliveredPackages || 0} />
      <StatCard label="Pending" value={overview.pendingPackages || 0} />
    </motion.div>
  );
};

const StatCard = memo(({ label, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
    className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 shadow-md text-center transition-all duration-200 hover:shadow-lg"
    role="region"
    aria-label={`${label} statistic`}
  >
    <p className="text-gray-300 text-sm font-medium uppercase tracking-wide">{label}</p>
    <p className="text-3xl font-extrabold text-white mt-2">{value}</p>
  </motion.div>
));

export default OverviewStats;