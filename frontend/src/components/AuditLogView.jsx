import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
        const res = await api.get('agent/audit-logs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(res.data);
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
      <h3>Delivery History (Audit Logs)</h3>
      {loading && <p>Loading audit logs...</p>}
      {logs.length === 0 && !loading && <p>No delivery history found.</p>}
      <ul>
        {logs.map(log => (
          <li key={log._id}>
            <strong>Package ID:</strong> {log.packageId} &mdash; <strong>Status:</strong> {log.status} &mdash; <strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLogView;
