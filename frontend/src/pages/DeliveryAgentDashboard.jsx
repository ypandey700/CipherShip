import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, withRoleProtection } from "../contexts/AuthContext";
import api from "../lib/api";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/useToast";
import PackageDetailView from "../components/PackageDetailView";
import AuditLogView from "../components/AuditLogView";
import QRScanner from "../components/QRScanner";

const DeliveryAgentDashboard = () => {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if unauthorized or not logged in
  useEffect(() => {
    if (!user || user.role !== "deliveryAgent") {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "This dashboard is for delivery agents only.",
        variant: "destructive",
      });
      return;
    }
  }, [user, navigate, toast]);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/agent/packages", {
        headers: { Authorization: Bearer ${token} },
      });
      setPackages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch packages";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    if (token) fetchPackages();
  }, [token, fetchPackages]);

  const onStatusUpdated = (newStatus) => {
    setPackages((prev) =>
      prev.map((p) =>
        p._id === selectedPackage._id ? { ...p, status: newStatus } : p
      )
    );
    setSelectedPackage((prev) => ({ ...prev, status: newStatus }));
    toast({
      title: "Success",
      description: Package status updated to ${newStatus}.,
      variant: "success",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6"
    >
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800 rounded-xl shadow-md mb-8 flex justify-between items-center p-6">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Delivery Agent Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-200">{user?.name || "Agent"}</span>
          <Button
            onClick={logout}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg py-2 px-4 transition-all duration-200"
            aria-label="Log out"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Packages Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-100">Packages</h2>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center py-6"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
            <span className="ml-4 text-lg font-semibold text-gray-300">Loading packages...</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-6"
          >
            <p className="text-red-400 text-lg font-semibold">{error}</p>
            <Button
              onClick={fetchPackages}
              className="mt-4 bg-blue-500 text-white hover:bg-blue-400 font-semibold rounded-lg py-2 px-4 transition-all duration-200"
              aria-label="Retry fetching packages"
            >
              Retry
            </Button>
          </motion.div>
        )}

        {!loading && !error && packages.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-400 py-6"
          >
            No packages assigned to you.
          </motion.p>
        )}

        {!loading && !error && packages.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {packages.map((pkg, index) => (
              <motion.li
                key={pkg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`cursor-pointer p-4 rounded-lg shadow-md transition-all duration-200 ${
                  selectedPackage?._id === pkg._id
                    ? "bg-blue-500/20 border border-blue-400"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setSelectedPackage(pkg)}
                role="button"
                aria-label={Select package ${pkg._id}}
              >
                <p className="font-medium text-gray-100">Package ID: {pkg._id}</p>
                <p className="text-sm text-gray-300 capitalize">Status: {pkg.status || "N/A"}</p>
              </motion.li>
            ))}
          </ul>
        )}

        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-gray-800 rounded-xl shadow-md p-6"
          >
            <PackageDetailView
              pkg={selectedPackage}
              token={token}
              onStatusUpdated={onStatusUpdated}
            />
          </motion.div>
        )}
      </section>

      {/* Delivery History Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-100">Delivery History</h2>
        <AuditLogView token={token} />
      </section>

      {/* Scan QR Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-100">Scan QR</h2>
        <QRScanner />
      </section>
    </motion.div>
  );
};

// Wrapped with role protection for export
const ProtectedDeliveryAgentDashboard = withRoleProtection(
  DeliveryAgentDashboard,
  ["deliveryAgent"]
);

export default ProtectedDeliveryAgentDashboard;