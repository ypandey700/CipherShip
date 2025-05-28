import React from "react";

const OverviewStats = ({ overview }) => {
  if (!overview)
    return (
      <p className="text-center text-gray-500 italic py-8">Loading stats...</p>
    );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      <StatCard label="Users" value={overview.totalUsers} />
      <StatCard label="Packages" value={overview.totalPackages} />
      <StatCard label="Delivered" value={overview.deliveredPackages} />
      <StatCard label="Pending" value={overview.pendingPackages} />
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow cursor-default">
    <p className="text-gray-400 uppercase text-xs tracking-wide mb-2">{label}</p>
    <p className="text-3xl font-extrabold text-blue-700">{value}</p>
  </div>
);

export default OverviewStats;
