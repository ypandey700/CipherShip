import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useToast } from "../hooks/useToast";

const OverviewStats = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/overview");
        setStats(res.data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch overview stats.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center">Loading stats...</p>;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <StatCard label="Users" value={stats.totalUsers} />
      <StatCard label="Delivery Agents" value={stats.totalAgents} />
      <StatCard label="Packages" value={stats.totalPackages} />
      <StatCard label="Delivered" value={stats.totalDelivered} />
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
