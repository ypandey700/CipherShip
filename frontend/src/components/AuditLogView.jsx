import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";

const AuditLogView = () => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get("/agent/audit-logs");
        setLogs(res);
      } catch {
        showToast("Failed to fetch audit logs.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token, showToast]);

  return (
    <div className="p-6 bg-white/90 border border-blue-100 rounded-xl shadow-sm backdrop-blur-md">
      <h3 className="text-2xl font-semibold text-blue-800 mb-4">
        Delivery History
      </h3>

      {loading && (
        <p className="text-blue-600 text-sm mb-4 animate-pulse">Loading audit logs...</p>
      )}

      {!loading && logs.length === 0 && (
        <p className="text-gray-500 text-sm">No delivery history found.</p>
      )}

      <ul className="space-y-4">
        {logs.map((log) => (
          <li
            key={log._id}
            className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all"
          >
            <div className="text-sm text-gray-800">
              <span className="font-semibold text-blue-900">Package ID:</span>{" "}
              {log.package}
            </div>
            <div className="text-sm text-gray-800">
              <span className="font-semibold text-blue-900">Action:</span>{" "}
              {log.action}
            </div>
            <div className="text-sm text-gray-800">
              <span className="font-semibold text-blue-900">Details:</span>{" "}
              {log.details || "—"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <span className="font-medium">Time:</span>{" "}
              {new Date(log.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLogView;
