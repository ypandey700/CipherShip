import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UsersTable from '../components/UsersTable';
import AddUserSheet from '../components/AddUserSheet';
import QRGenerator from '../components/QRGenerator';
import OverviewStats from '../components/OverviewStats';
import AuditLogs from '../components/AuditLogs';
import PackagesTable from '../components/PackagesTable';

import api from '../lib/api';

import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [overview, setOverview] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Load everything except audit logs on mount
    const loadData = async () => {
      setLoading(true);
      try {
        const [usersRes, overviewRes, packagesRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/overview'),
          api.get('/admin/packages'),
        ]);
  
        setUsers(usersRes.users || []);
        setOverview(overviewRes || null); // overviewRes is already parsed JSON
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

  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const auditRes = await api.get(`/admin/audit-logs?ts=${Date.now()}`);
      setAuditLogs(
        Array.isArray(auditRes) ? auditRes : 
        auditRes.auditLogs || auditRes.logs || []
      );
    } catch (error) {
      toast.error('Failed to load audit logs');
      console.error(error);
    } finally {
      setAuditLoading(false);
    }
  };  

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'audit') {
      fetchAuditLogs();
    }
  };

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

  // New handler to navigate to user profile page
  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <nav className="mb-4 space-x-2">
        <button onClick={() => handleTabChange('users')} disabled={activeTab === 'users'}>
          Users
        </button>
        <button onClick={() => handleTabChange('packages')} disabled={activeTab === 'packages'}>
          Packages
        </button>
        <button onClick={() => handleTabChange('overview')} disabled={activeTab === 'overview'}>
          Overview
        </button>
        <button onClick={() => handleTabChange('audit')} disabled={activeTab === 'audit'}>
          Audit Logs
        </button>
      </nav>
      <section>
        {activeTab === 'users' && (
          <>
            <AddUserSheet onUserCreated={handleUserCreated} />
            <UsersTable
              users={users}
              onUserUpdated={handleUserUpdated}
              onUserDeleted={handleUserDeleted}
              onUserClick={handleUserClick} // Pass the click handler
            />
          </>
        )}
        {activeTab === 'packages' && (
          <>
            <QRGenerator onPackageCreated={handlePackageCreated} />
            <PackagesTable packages={packages} />
          </>
        )}
        {activeTab === 'overview' && <OverviewStats overview={overview} />}
        {activeTab === 'audit' && (auditLoading ? <p>Loading audit logs...</p> : <AuditLogs logs={auditLogs} />)}
      </section>
    </div>
  );
};

export default AdminDashboard;
