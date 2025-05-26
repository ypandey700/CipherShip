import React from "react";

const OverviewStats = ({ overview }) => {
  if (!overview) return <p className="text-center">Loading stats...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <StatCard label="Users" value={overview.totalUsers} />
      <StatCard label="Packages" value={overview.totalPackages} />
      <StatCard label="Delivered" value={overview.deliveredPackages} />
      <StatCard label="Pending" value={overview.pendingPackages} />
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl p-4 shadow text-center">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default OverviewStats;
