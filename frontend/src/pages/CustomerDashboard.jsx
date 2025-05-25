import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api"; // ✅ Adjust path if necessary

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Role-based protection
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "customer") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/customer/packages"); // ✅ Uses api.get
      setPackages(data.packages || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  if (loading) return <div>Loading your packages...</div>;

  if (error) {
    return (
      <div style={{ color: "red" }}>
        Error: {error}
        <button onClick={fetchPackages} style={{ marginLeft: 8 }}>
          Retry
        </button>
      </div>
    );
  }

  if (!packages.length) {
    return <div>No packages found for your account.</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Your Packages</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={thStyle}>Package ID</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Tracking Number</th>
            <th style={thStyle}>Created At</th>
            <th style={thStyle}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg._id || pkg.packageId}>
              <td style={tdStyle}>{pkg.packageId}</td>
              <td style={tdStyle}>{pkg.deliveryStatus}</td>
              <td style={tdStyle}>{pkg.trackingNumber || "-"}</td>
              <td style={tdStyle}>{new Date(pkg.createdAt).toLocaleString()}</td>
              <td style={tdStyle}>{new Date(pkg.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #ccc",
  padding: "0.5rem",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "0.5rem",
};
