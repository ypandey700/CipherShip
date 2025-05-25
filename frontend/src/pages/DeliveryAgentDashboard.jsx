import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { withRoleProtection, useAuth } from "../contexts/AuthContext";
import PackageDetailView from "../components/PackageDetailView";
import AuditLogView from "../components/AuditLogView";
import { useToast } from "../hooks/useToast";

const DeliveryAgentDashboard = () => {
  const { token, logout, user } = useAuth();
  const { showToast, ToastComponent } = useToast();

  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("packages");

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
        showToast("Failed to fetch packages", "error");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchPackages();
  }, [token, showToast]);

  const onStatusUpdated = (newStatus) => {
    setPackages((prev) =>
      prev.map((p) =>
        p._id === selectedPackage._id ? { ...p, status: newStatus } : p
      )
    );
    setSelectedPackage((prev) => ({ ...prev, status: newStatus }));
    showToast(`Status updated to "${newStatus}"`, "success");
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-secondary/50">
      <header className="border-b bg-background mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Delivery Agent Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">{user?.name}</span>
          <Button variant="ghost" size="icon" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="mb-6 space-x-4">
        <Button
          variant={activeTab === "packages" ? "default" : "ghost"}
          onClick={() => setActiveTab("packages")}
        >
          Packages
        </Button>
        <Button
          variant={activeTab === "auditLogs" ? "default" : "ghost"}
          onClick={() => setActiveTab("auditLogs")}
        >
          Delivery History
        </Button>
      </div>

      {activeTab === "packages" && (
        <>
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
        </>
      )}

      {activeTab === "auditLogs" && <AuditLogView token={token} />}

      <ToastComponent />
    </div>
  );
};

export default withRoleProtection(DeliveryAgentDashboard, ["delivery_agent"]);
