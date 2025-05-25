import React, { useEffect, useState } from 'react';
import UsersTable from '../components/UsersTable';
import AddUserSheet from '../components/AddUserSheet';
import QRGenerator from '../components/QRGenerator';
import OverviewStats from '../components/OverviewStats';
import AuditLogs from '../components/AuditLogs';

import api from '../lib/api'; //

import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [overview, setOverview] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [usersRes, overviewRes, auditRes, packagesRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/overview'),
          api.get('/admin/audit-logs'),
          api.get('/admin/packages'),
        ]);
  
        setUsers(usersRes.users || []);
        setOverview(overviewRes);
        setAuditLogs(auditRes.auditLogs || auditRes.logs || []);
        setPackages(packagesRes.packages || []);
      } catch (error) {
        toast.error('Failed to load admin data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []);

  const handleUserCreated = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    toast.success('User created successfully');
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
    toast.success('User updated successfully');
  };

  const handleUserDeleted = (userId) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
    toast.success('User deleted successfully');
  };

  const handlePackageCreated = (newPackage) => {
    setPackages((prev) => [...prev, newPackage]);
    toast.success('Package created successfully');
  };

  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <nav className="mb-4 space-x-2">
        <button onClick={() => setActiveTab('users')} disabled={activeTab === 'users'}>Users</button>
        <button onClick={() => setActiveTab('packages')} disabled={activeTab === 'packages'}>Packages</button>
        <button onClick={() => setActiveTab('overview')} disabled={activeTab === 'overview'}>Overview</button>
        <button onClick={() => setActiveTab('audit')} disabled={activeTab === 'audit'}>Audit Logs</button>
      </nav>
      <section>
        {activeTab === 'users' && (
          <>
            <AddUserSheet onUserCreated={handleUserCreated} />
            <UsersTable users={users} onUserUpdated={handleUserUpdated} onUserDeleted={handleUserDeleted} />
          </>
        )}
        {activeTab === 'packages' && (
          <QRGenerator packages={packages} onPackageCreated={handlePackageCreated} />
        )}
        {activeTab === 'overview' && <OverviewStats overview={overview} />}
        {activeTab === 'audit' && <AuditLogs logs={auditLogs} />}
      </section>
    </div>
  );
};

export default AdminDashboard;
