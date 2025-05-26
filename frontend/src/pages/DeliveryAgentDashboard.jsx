import React, { useEffect, useState } from "react";
import api from "../lib/api";
// import { Button } from "../components/ui/button";
import { withRoleProtection, useAuth } from "../contexts/AuthContext";
import PackageDetailView from "../components/PackageDetailView";
import AuditLogView from "../components/AuditLogView";
import QRScanner from "../components/QRScanner";

console.log("PackageDetailView:", PackageDetailView);
console.log("AuditLogView:", AuditLogView);
console.log("QRScanner:", QRScanner);

const DeliveryAgentDashboard = () => {
  const { token, logout, user } = useAuth();

  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/agent/packages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackages(res.data);
      } catch {
        setError("Failed to fetch packages");
        // Removed showToast call
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchPackages();
  }, [token]);

  const onStatusUpdated = (newStatus) => {
    setPackages((prev) =>
      prev.map((p) =>
        p._id === selectedPackage._id ? { ...p, status: newStatus } : p
      )
    );
    setSelectedPackage((prev) => ({ ...prev, status: newStatus }));
    // Removed showToast call
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-secondary/50">
      <header className="border-b bg-background mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Delivery Agent Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">{user?.name}</span>
          <button onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Packages Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Packages</h2>
        {loading && <p className="text-center text-blue-600">Loading packages...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <ul className="mb-6">
          {packages.map((pkg) => (
            <li
              key={pkg._id}
              className={`cursor-pointer mb-2 p-2 rounded ${
                selectedPackage?._id === pkg._id ? "font-bold bg-primary/20" : ""
              }`}
              onClick={() => setSelectedPackage(pkg)}
            >
              Package ID: {pkg._id} — Status: {pkg.status}
            </li>
          ))}
        </ul>

        {selectedPackage ? (
          <PackageDetailView
            pkg={selectedPackage}
            token={token}
            onStatusUpdated={onStatusUpdated}
          />
        ) : (
          <p>Select a package to see details</p>
        )}
      </section>

      {/* Delivery History Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Delivery History</h2>
        <AuditLogView token={token} />
      </section>

      {/* Scan QR Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Scan QR</h2>
        <QRScanner />
      </section>
    </div>
  );
};

// Wrapped with role protection for export
const ProtectedDeliveryAgentDashboard = withRoleProtection(
  DeliveryAgentDashboard,
  ["deliveryAgent"]
);

export default ProtectedDeliveryAgentDashboard;