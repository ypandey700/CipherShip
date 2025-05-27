import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/useToast";

export default function CustomerDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if unauthorized or not logged in
  useEffect(() => {
    if (loading) return; // wait for auth loading

    if (!user) {
      navigate("/login");
      toast({
        title: "Unauthorized",
        description: "Please log in to view your dashboard.",
        variant: "destructive",
      });
      return;
    }
    if (user.role !== "customer") {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "This dashboard is for customers only.",
        variant: "destructive",
      });
      return;
    }
  }, [user, loading, navigate, toast]);

  const fetchPackages = useCallback(async () => {
    setLoadingPackages(true);
    setError(null);
    try {
      const data = await api.get("/customer/packages");
      setPackages(data.packages || []);
    } catch (err) {
      setError(err.message || "Failed to fetch packages");
      toast({
        title: "Error",
        description: err.message || "Failed to fetch packages",
        variant: "destructive",
      });
    } finally {
      setLoadingPackages(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  if (loading || loadingPackages) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
        <span className="ml-4 text-lg font-semibold">Loading your packages...</span>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
      >
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold">Error: {error}</p>
          <Button
            onClick={fetchPackages}
            className="mt-4 bg-blue-500 text-white hover:bg-blue-400 font-semibold rounded-lg py-2 px-4 transition-all duration-200"
            aria-label="Retry fetching packages"
          >
            Retry
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!packages.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-400 py-6"
      >
        No packages found for your account.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6"
    >
      <h1 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Welcome, {user?.name || "Customer"}
      </h1>
      <h2 className="text-2xl font-semibold mb-6">Your Packages</h2>
      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-2xl">
        <table className="min-w-full text-gray-100">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-left text-sm font-semibold uppercase tracking-wide">
              <th className="py-4 px-6">Package ID</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Tracking Number</th>
              <th className="py-4 px-6">Created At</th>
              <th className="py-4 px-6">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg, index) => (
              <motion.tr
                key={pkg._id || pkg.packageId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`border-t border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                }`}
              >
                <td className="py-4 px-6 text-sm">{pkg.packageId || "N/A"}</td>
                <td className="py-4 px-6 text-sm capitalize">{pkg.deliveryStatus || "N/A"}</td>
                <td className="py-4 px-6 text-sm">{pkg.trackingNumber || "-"}</td>
                <td className="py-4 px-6 text-sm">
                  {pkg.createdAt
                    ? new Date(pkg.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </td>
                <td className="py-4 px-6 text-sm">
                  {pkg.updatedAt
                    ? new Date(pkg.updatedAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};