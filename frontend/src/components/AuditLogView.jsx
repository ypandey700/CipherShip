// AuditLogView.jsx

import React, { useEffect, useState } from 'react';
import api from "../lib/api";
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const AuditLogView = () => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get('/agent/audit-logs'); // ✅ fixed usage
        setLogs(res);
      } catch {
        showToast('Failed to fetch audit logs.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token, showToast]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Delivery History (Audit Logs)</h3>
      {loading && <p>Loading audit logs...</p>}
      {logs.length === 0 && !loading && <p>No delivery history found.</p>}
      <ul className="space-y-2">
        {logs.map(log => (
          <li key={log._id} className="p-2 border rounded shadow-sm">
            <div><strong>Package ID:</strong> {log.package}</div>
            <div><strong>Action:</strong> {log.action}</div>
            <div><strong>Details:</strong> {log.details || '—'}</div>
            <div><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLogView;
